import { execFileSync } from 'node:child_process';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import ffmpegPath from 'ffmpeg-static';

const root = process.cwd();
const output = path.join(root,'public','story');
const temp = path.join(os.tmpdir(),'maison-sienna-films');
const clips = [
  {name:'a',url:'https://videos.pexels.com/video-files/3768984/3768984-hd_1920_1080_25fps.mp4',fps:'3.15'},
  {name:'b',url:'https://videos.pexels.com/video-files/3780201/3780201-hd_1920_1080_25fps.mp4',fps:'3.00'},
];
if (!ffmpegPath || !existsSync(ffmpegPath)) throw new Error('FFmpeg missing');
await mkdir(output,{recursive:true});
await mkdir(temp,{recursive:true});

function run(args){
  execFileSync(ffmpegPath,['-hide_banner','-loglevel','error','-y',...args],{stdio:'inherit',timeout:120000});
}
async function download(url,target){
  for(let attempt=1;attempt<=3;attempt++){
    try{
      const response=await fetch(url,{signal:AbortSignal.timeout(45000)});
      if(!response.ok)throw new Error('Video download HTTP '+response.status);
      const kind=response.headers.get('content-type')||'';
      if(!kind.includes('video')&&!kind.includes('octet-stream'))throw new Error('Not a video: '+kind);
      const bytes=Buffer.from(await response.arrayBuffer());
      if(bytes.byteLength<100000||bytes.byteLength>60000000)throw new Error('Unexpected film size '+bytes.byteLength);
      await writeFile(target,bytes);
      return;
    }catch(error){
      if(attempt===3)throw error;
      await new Promise(resolve=>setTimeout(resolve,attempt*750));
    }
  }
}
try{
  for(const clip of clips){
    const input=path.join(temp,'chef-'+clip.name+'.mp4');
    await download(clip.url,input);
    run(['-i',input,'-vf','fps='+clip.fps+',scale=768:432:flags=lanczos,tile=4x4:nb_frames=16','-frames:v','2','-c:v','libwebp','-quality','77','-compression_level','5',path.join(output,'scene-'+clip.name+'-%02d.webp')]);
  }
  const hero=path.join(temp,'chef-a.mp4');
  run(['-ss','3','-i',hero,'-vf','scale=1280:-2','-frames:v','1','-q:v','3',path.join(output,'hero-poster.jpg')]);
  run(['-i',hero,'-vf','scale=1280:720:flags=lanczos','-c:v','libx264','-crf','27','-preset','fast','-movflags','+faststart','-an',path.join(output,'hero-720.mp4')]);
  run(['-i',hero,'-vf','scale=1280:720:flags=lanczos','-c:v','libvpx-vp9','-b:v','0','-crf','36','-deadline','good','-cpu-used','5','-an',path.join(output,'hero-720.webm')]);
  for(const name of ['scene-a-01.webp','scene-a-02.webp','scene-b-01.webp','scene-b-02.webp','hero-poster.jpg','hero-720.mp4','hero-720.webm']){
    if(!existsSync(path.join(output,name)))throw new Error('Missing media '+name);
  }
  console.log('Built 64 genuine video frames across 4 WebP sheets and optimized local hero MP4.');
}finally{
  await rm(temp,{recursive:true,force:true});
}
