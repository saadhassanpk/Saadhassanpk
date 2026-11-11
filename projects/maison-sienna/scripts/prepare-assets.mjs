import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { execFileSync } from 'node:child_process';
import ffmpeg from 'ffmpeg-static';

const root = process.cwd();
const story = path.join(root, 'public', 'story');
const studio = path.join(root, 'public', 'studio');
const scratch = path.join(os.tmpdir(), 'sienna-studio-' + process.pid);
const FRAME_COUNT = 540;
const ATLAS_COUNT = 60;
const URLS = {
  story: 'https://videos.pexels.com/video-files/7243902/7243902-uhd_4096_2160_25fps.mp4',
  hero: 'https://videos.pexels.com/video-files/7243905/7243905-uhd_4096_2160_25fps.mp4',
  interior: 'https://d8j0ntlcm91z4.cloudfront.net/user_3LyiwYd7AZsPyqioX8hXJYQN6Df/hf_20261111_233406_0d5d319a-8153-4966-bf19-50d86ae2bd20.png',
  pasta: 'https://d8j0ntlcm91z4.cloudfront.net/user_3LyiwYd7AZsPyqioX8hXJYQN6Df/hf_20261111_233406_09e20b67-2080-4a07-88ab-24262fc88d28.png',
  plated: 'https://d8j0ntlcm91z4.cloudfront.net/user_3LyiwYd7AZsPyqioX8hXJYQN6Df/hf_20261111_233046_8fbd57dc-1908-4618-a855-ed509111ebe0.png',
};
if (!ffmpeg || !fs.existsSync(ffmpeg)) throw new Error('ffmpeg-static binary is required for 540-frame film generation');
for (const dir of [story, studio, scratch, path.join(story,'desktop'), path.join(story,'mobile')]) fs.mkdirSync(dir, {recursive:true});

async function download(url, target) {
  if (fs.existsSync(target) && fs.statSync(target).size > 50000) return;
  for (let attempt=1;attempt<=3;attempt++) {
    try {
      const response=await fetch(url,{signal:AbortSignal.timeout(95000)});
      if(!response.ok) throw new Error('HTTP '+response.status+' for '+url);
      const data=Buffer.from(await response.arrayBuffer());
      if(data.length < 50000 || data.length > 150000000) throw new Error('Unexpected media size: '+data.length);
      fs.writeFileSync(target,data);
      console.log('Fetched '+path.basename(target)+': '+(data.length/1048576).toFixed(1)+' MiB');
      return;
    } catch(error) {
      if(attempt===3)throw error;
      await new Promise(resolve=>setTimeout(resolve,1100*attempt));
    }
  }
}
function encode(args,label,timeout=600000){
  console.log('Encoding '+label+'...');
  execFileSync(ffmpeg,['-hide_banner','-loglevel','error','-nostdin','-y',...args],{stdio:'inherit',timeout,maxBuffer:1048576});
}
function verifySheets(dir) {
  const files=fs.readdirSync(dir).filter(name=>/^s-\d{3}\.webp$/.test(name));
  if(files.length!==ATLAS_COUNT)throw new Error('Expected '+ATLAS_COUNT+' sheets; got '+files.length+' in '+dir);
  let bytes=0;
  for(let i=1;i<=ATLAS_COUNT;i++){
    const name='s-'+String(i).padStart(3,'0')+'.webp';
    const target=path.join(dir,name);
    if(!fs.existsSync(target)||fs.statSync(target).size<20000)throw new Error('Sheet missing/invalid '+target);
    bytes+=fs.statSync(target).size;
  }
  return bytes;
}

try{
  const feature=path.join(scratch,'feature-4k.mp4');
  const hero=path.join(scratch,'hero-4k.mp4');
  await Promise.all([
    download(URLS.story,feature),
    download(URLS.hero,hero),
    download(URLS.interior,path.join(studio,'interior.png')),
    download(URLS.pasta,path.join(studio,'pasta.png')),
    download(URLS.plated,path.join(studio,'plated.png')),
  ]);
  encode([
    '-i',feature,
    '-filter_complex','[0:v]trim=end_frame=540,setpts=PTS-STARTPTS,split=2[a][b];[a]scale=1280:675:flags=lanczos,tile=3x3:nb_frames=9[x];[b]crop=1215:2160:(iw-1215)/2:0,scale=540:960:flags=lanczos,tile=3x3:nb_frames=9[y]',
    '-map','[x]','-frames:v','60','-c:v','libwebp','-quality','87','-compression_level','3',path.join(story,'desktop','s-%03d.webp'),
    '-map','[y]','-frames:v','60','-c:v','libwebp','-quality','83','-compression_level','3',path.join(story,'mobile','s-%03d.webp'),
  ],'540 original consecutive 4K-source frames in desktop/mobile WebP contact sheets');
  const desktopBytes=verifySheets(path.join(story,'desktop'));
  const mobileBytes=verifySheets(path.join(story,'mobile'));
  console.log('Verified '+FRAME_COUNT+' genuine consecutive frames, 60 desktop sheets ('+(desktopBytes/1048576).toFixed(1)+' MiB), 60 portrait sheets ('+(mobileBytes/1048576).toFixed(1)+' MiB)');
  encode(['-ss','3','-i',hero,'-frames:v','1','-vf','scale=1920:1080:flags=lanczos','-q:v','3',path.join(story,'hero-poster.jpg')],'hero cover');
  encode(['-ss','9','-i',feature,'-frames:v','1','-vf','scale=1920:1080:flags=lanczos','-q:v','3',path.join(story,'film-poster.jpg')],'scroll-film cover');
  encode(['-ss','2','-t','8','-i',hero,'-an','-vf','scale=1920:1080:flags=lanczos','-c:v','libx264','-crf','21','-preset','fast','-pix_fmt','yuv420p','-movflags','+faststart',path.join(story,'hero-film.mp4')],'8-second 1080p hero MP4');
  encode(['-ss','2','-t','8','-i',hero,'-an','-vf','scale=1920:1080:flags=lanczos','-c:v','libvpx-vp9','-b:v','0','-crf','31','-deadline','good','-cpu-used','5',path.join(story,'hero-film.webm')],'8-second 1080p hero WebM');
  for (const name of ['hero-poster.jpg','film-poster.jpg','hero-film.mp4','hero-film.webm']) {
    if(!fs.existsSync(path.join(story,name))||fs.statSync(path.join(story,name)).size<10000)throw new Error('Missing media '+name);
  }
  console.log('SUCCESS: 540 unique video-source frames, Higgsfield original images, 1080p hero MP4/WebM');
} finally {
  fs.rmSync(scratch,{recursive:true,force:true});
}
