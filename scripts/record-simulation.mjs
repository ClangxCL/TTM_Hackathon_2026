import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const videosDir = path.join(rootDir, 'videos');
const rawVideosDir = path.join(videosDir, 'raw');
const publicVideosDir = path.join(rootDir, 'public', 'videos');
const distVideosDir = path.join(distDir, 'videos');

[videosDir, rawVideosDir, publicVideosDir, distVideosDir].forEach((d) => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// MIME types dictionary
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.yaml': 'text/yaml',
  '.txt': 'text/plain',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
};

// 1. Start local HTTP server serving dist
function startServer(port = 5199) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let reqPath = decodeURIComponent(req.url.split('?')[0]);
      if (reqPath.startsWith('/TTM_Hackathon_2026')) {
        reqPath = reqPath.replace('/TTM_Hackathon_2026', '');
      }
      if (reqPath === '' || reqPath === '/') {
        reqPath = '/index.html';
      }

      let filePath = path.join(distDir, reqPath);
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(distDir, 'index.html');
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      try {
        const content = fs.readFileSync(filePath);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error: ' + err.message);
      }
    });

    server.listen(port, '127.0.0.1', () => {
      console.log(`[SERVER] Serving dist at http://127.0.0.1:${port}/`);
      resolve(server);
    });
  });
}

// Helpers for simulation
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function smoothScroll(page, targetY, steps = 20, delayMs = 35) {
  const startY = await page.evaluate(() => window.scrollY);
  const delta = (targetY - startY) / steps;
  for (let i = 1; i <= steps; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), startY + delta * i);
    await sleep(delayMs);
  }
}

async function typeInto(page, selector, text, delayMs = 30) {
  await page.focus(selector);
  await page.fill(selector, '');
  await page.type(selector, text, { delay: delayMs });
}

// Main execution
async function run() {
  console.log('=== STARTING CLINICAL SIMULATION VIDEO RECORDING ===');
  const server = await startServer(5199);
  const chromePath =
    'C:/Users/Khuna/AppData/Local/ms-playwright/chromium-1248/chrome-win64/chrome.exe';

  console.log('[BROWSER] Launching Chromium with recording...');
  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-web-security',
      '--hide-scrollbars',
      '--window-size=1280,720',
    ],
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: {
      dir: rawVideosDir,
      size: { width: 1280, height: 720 },
    },
  });

  const page = await context.newPage();

  try {
    // SCENE 1: Landing Page & Cohort Overview
    console.log('[SCENE 1] Loading Landing Page & VejVivat Branding...');
    await page.goto('http://127.0.0.1:5199/#/', { waitUntil: 'networkidle' });
    await sleep(2500);

    // Scroll to show 5-Step Smart Workflow and 4 Pillars
    console.log('[SCENE 1] Revealing 4 Core Pillars & Workflow badges...');
    await smoothScroll(page, 450, 25, 40);
    await sleep(2000);

    // Scroll to 30 Cases Cohort List
    console.log('[SCENE 1] Scrolling to 30-Patient Synthetic Cohort list...');
    await smoothScroll(page, 950, 30, 35);
    await sleep(1500);

    // Hover over Case Cards (C01, C02, C03)
    const caseCards = await page.$$('button:has-text("เคส"), div:has-text("C02")');
    if (caseCards.length > 0) {
      await caseCards[0].hover();
      await sleep(800);
    }
    await sleep(1500);

    // SCENE 2: Patient Intake Modal (New Patient Registration)
    console.log('[SCENE 2] Opening Patient Intake Modal...');
    await smoothScroll(page, 0, 20, 30);
    await sleep(800);

    const intakeBtn = await page.$(
      'button:has-text("+ คีย์เพิ่มเคสผู้ป่วยใหม่"), button:has-text("+ ผู้ป่วยใหม่")'
    );
    if (intakeBtn) {
      await intakeBtn.click();
      await sleep(1200);

      console.log('[SCENE 2] Entering New Patient Details...');
      // Fill form inputs
      const nameInput = await page.$('input[placeholder*="สมศรี"], input[placeholder*="ชื่อ"]');
      if (nameInput) {
        await typeInto(page, 'input[placeholder*="สมศรี"], input[placeholder*="ชื่อ"]', 'นายวีระศักดิ์ สุขประเสริฐ (เคสจำลองทดสอบ)', 25);
        await sleep(400);
      }

      const birthInput = await page.$('input[type="date"]');
      if (birthInput) {
        await birthInput.fill('1978-05-15');
        await sleep(500);
      }

      // SBP, DBP, Pulse
      const sbpInput = await page.$('input[placeholder="120"], input[type="number"]:nth-of-type(1)');
      if (sbpInput) {
        await sbpInput.fill('145');
        await sleep(300);
      }

      // Chief complaint textarea
      const complaintInput = await page.$('textarea[placeholder*="อาการ"]');
      if (complaintInput) {
        await typeInto(page, 'textarea[placeholder*="อาการ"]', 'ปวดตึงต้นคอบ่าไหล่เรื้อรัง (โรคลมปลายปัตฆาต) ปวดร้าวลงแขน ระดับ 8/10', 20);
        await sleep(800);
      }

      await sleep(2000); // Allow audience to admire the auto-computed birth element

      // Click save or close modal
      const saveModalBtn = await page.$('button:has-text("บันทึกข้อมูลและเริ่มประเมินสมุฏฐาน"), button:has-text("บันทึก")');
      if (saveModalBtn) {
        await saveModalBtn.click();
        await sleep(1500);
      } else {
        const closeBtn = await page.$('button[title*="ปิด"], button:has-text("ยกเลิก")');
        if (closeBtn) await closeBtn.click();
      }
    }

    // SCENE 3: Smutthan Diagnostic Evaluation (Case C02)
    console.log('[SCENE 3] Navigating to Smutthan Evaluation (Case C02)...');
    await page.goto('http://127.0.0.1:5199/#/smutthan', { waitUntil: 'networkidle' });
    await sleep(2000);

    // Show live weather & ambient context
    console.log('[SCENE 3] Reviewing Ambient Weather and Element Radar Chart...');
    await smoothScroll(page, 320, 20, 35);
    await sleep(2500); // Show radar chart: Wind (วาโย 78) & Fire (เตโช 65)

    // Scroll down to Rule Breakdown
    console.log('[SCENE 3] Examining Explainable AI Rule Breakdown...');
    await smoothScroll(page, 650, 20, 35);
    await sleep(2000);

    // Demonstrate Clinician Override
    const overrideBtn = await page.$('button:has-text("ปรับเปลี่ยนผลการวินิจฉัย (Override)")');
    if (overrideBtn) {
      await overrideBtn.click();
      await sleep(1000);

      const overrideNote = await page.$('textarea[placeholder*="เหตุผล"], textarea');
      if (overrideNote) {
        await typeInto(
          page,
          'textarea[placeholder*="เหตุผล"], textarea',
          'ผู้ป่วยสูงอายุ มีอาการจุกแน่นลมกษัยเด่นชัด ตรวจพบวาโยธาตุกำเริบสัมพันธ์กับประวัติยาวาร์ฟาริน',
          20
        );
        await sleep(800);
      }

      const saveOverrideBtn = await page.$('button:has-text("บันทึกการ Override")');
      if (saveOverrideBtn) {
        await saveOverrideBtn.click();
        await sleep(1200);
      }
    }

    // SCENE 4: Herb Prescribing & High-Risk HDI Screening
    console.log('[SCENE 4] Moving to Herb Prescription & HDI Screening...');
    const toPrescribeBtn = await page.$('button:has-text("ดำเนินการสั่งยาแผนไทย"), button:has-text("ต่อไป: สั่งยาสมุนไพร")');
    if (toPrescribeBtn) {
      await toPrescribeBtn.click();
    } else {
      await page.goto('http://127.0.0.1:5199/#/prescribe', { waitUntil: 'networkidle' });
    }
    await sleep(2000);

    // Look at Herb Form and High-Risk Warning
    console.log('[SCENE 4] Inspecting Centralized HDI Warning (Turmeric + Warfarin)...');
    await smoothScroll(page, 200, 15, 30);
    await sleep(2000);

    // Click Add to cart
    const addToCartBtn = await page.$('button:has-text("เพิ่มรายการลงในใบสั่งยา")');
    if (addToCartBtn) {
      await addToCartBtn.click();
      await sleep(1500);
    }

    // Scroll to cart
    await smoothScroll(page, 450, 15, 30);
    await sleep(1500);

    // Acknowledge High Risk Warning if present
    const ackBtn = await page.$('button:has-text("ยืนยันรับทราบคำเตือน")');
    if (ackBtn) {
      console.log('[SCENE 4] Demonstrating Clinician Two-Key Acknowledgment & Override...');
      await ackBtn.click();
      await sleep(1000);

      const ackInput = await page.$('textarea');
      if (ackInput) {
        await typeInto(
          page,
          'textarea',
          'นัดตรวจติดตามค่า INR ทุกสัปดาห์ และตรวจอาการเลือดออกผิดปกติ/จ้ำเลือดตามระเบียบ VejVivat Care Plan',
          20
        );
        await sleep(800);
      }

      const confirmAckBtn = await page.$('button:has-text("บันทึกเหตุผลและยืนยัน")');
      if (confirmAckBtn) {
        await confirmAckBtn.click();
        await sleep(1500);
      }
    }

    // SCENE 5: Prescription Printout & Medical Record Summary
    console.log('[SCENE 5] Proceeding to Prescription Print & FHIR Summary...');
    const toPrintBtn = await page.$('button:has-text("ดำเนินการต่อไป: ตรวจสอบและพิมพ์ใบสั่งยา"), button:has-text("พิมพ์ใบสั่งยา")');
    if (toPrintBtn) {
      await toPrintBtn.click();
    } else {
      await page.goto('http://127.0.0.1:5199/#/prescription-print', { waitUntil: 'networkidle' });
    }
    await sleep(2000);

    // Smooth scroll down the clinical leaflet
    console.log('[SCENE 5] Displaying Official Clinical Prescription Leaflet...');
    await smoothScroll(page, 380, 20, 35);
    await sleep(2000);
    await smoothScroll(page, 750, 20, 35);
    await sleep(2000);

    // SCENE 6: Evidence-Based Clinical Care Plan & Longitudinal Trajectory
    console.log('[SCENE 6] Transitioning to Final Step: Care Plan & Trajectory Dashboard...');
    const toCarePlanBtn = await page.$('button:has-text("ขั้นตอนถัดไป: แผนการรักษา & ตารางติดตามผลรายบุคคล"), button:has-text("แผนการรักษา")');
    if (toCarePlanBtn) {
      await toCarePlanBtn.click();
    } else {
      await page.goto('http://127.0.0.1:5199/#/care-plan', { waitUntil: 'networkidle' });
    }
    await sleep(2500);

    // Tab 1: Academic Monthly Cadence & Monitoring Domains
    console.log('[SCENE 6] Tab 1: Monthly Cadence Matrix & 4 Clinical Monitoring Domains...');
    await smoothScroll(page, 300, 20, 35);
    await sleep(2500);
    await smoothScroll(page, 650, 20, 35);
    await sleep(2500);

    // Tab 2: Longitudinal Trajectory Dashboard (Recharts Visualizations)
    console.log('[SCENE 6] Tab 2: Longitudinal Trajectory Charts (VAS Pain, Tridosha Equilibrium, Vitals)...');
    await smoothScroll(page, 150, 15, 30);
    const tab2Btn = await page.$('button:has-text("2. แนวโน้มสรุปการดูแลรักษารายบุคคล")');
    if (tab2Btn) {
      await tab2Btn.click();
      await sleep(2000); // Allow charts to animate

      console.log('[SCENE 6] Reviewing Recharts Visualizations...');
      await smoothScroll(page, 450, 20, 40);
      await sleep(3500); // Admire Pain & Tridosha convergence charts
      await smoothScroll(page, 850, 20, 40);
      await sleep(3000); // Admire Vitals & PROM score charts
    }

    // Tab 3: Holistic Self-Care & Emergency Red Flags
    console.log('[SCENE 6] Tab 3: Holistic Self-Care Guidance & Emergency Red Flags...');
    await smoothScroll(page, 150, 15, 30);
    const tab3Btn = await page.$('button:has-text("3. แผนการดูแลตนเองและสัญญาณเตือนฉุกเฉิน")');
    if (tab3Btn) {
      await tab3Btn.click();
      await sleep(2000);
      await smoothScroll(page, 400, 20, 35);
      await sleep(3000);
    }

    // SCENE 7: Outro & VejVivat Brand Summary
    console.log('[SCENE 7] Outro: Returning to Home & Brand Summary...');
    await page.goto('http://127.0.0.1:5199/#/', { waitUntil: 'networkidle' });
    await sleep(1000);
    await smoothScroll(page, 0, 15, 30);
    await sleep(3000);

    console.log('[SIMULATION] Finished clinical workflow walkthrough successfully!');
  } catch (err) {
    console.error('[SIMULATION ERROR]', err);
  } finally {
    // Close context and browser to finalize video recording
    console.log('[RECORDING] Finalizing and closing browser video stream...');
    await page.close();
    await context.close();
    await browser.close();
    server.close();
  }

  // 2. Post-process video with FFmpeg
  console.log('[FFMPEG] Locating recorded WebM video...');
  const recordedFiles = fs
    .readdirSync(rawVideosDir)
    .filter((f) => f.endsWith('.webm'))
    .map((f) => path.join(rawVideosDir, f))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);

  if (recordedFiles.length === 0) {
    throw new Error('No recorded video file found in ' + rawVideosDir);
  }

  const rawWebmPath = recordedFiles[0];
  console.log(`[FFMPEG] Found raw video: ${rawWebmPath} (${(fs.statSync(rawWebmPath).size / 1024 / 1024).toFixed(2)} MB)`);

  const ffmpegExe =
    'C:/Users/Khuna/AppData/Local/Programs/Python/Python312/Lib/site-packages/imageio_ffmpeg/binaries/ffmpeg-win-x86_64-v7.1.exe';

  const outMp4Public = path.join(publicVideosDir, 'ttm-vejvivat-demo.mp4');
  const outMp4Dist = path.join(distVideosDir, 'ttm-vejvivat-demo.mp4');
  const outWebmPublic = path.join(publicVideosDir, 'ttm-vejvivat-demo.webm');
  const outWebmDist = path.join(distVideosDir, 'ttm-vejvivat-demo.webm');
  const outPoster = path.join(publicVideosDir, 'demo-poster.png');
  const outGif = path.join(publicVideosDir, 'demo-preview.gif');

  // Copy WebM
  fs.copyFileSync(rawWebmPath, outWebmPublic);
  fs.copyFileSync(rawWebmPath, outWebmDist);
  console.log(`[FFMPEG] WebM exported to: ${outWebmPublic}`);

  // Transcode to MP4 (H.264 / AAC, faststart for streaming)
  console.log('[FFMPEG] Encoding H.264 / MP4 video...');
  const ffmpegMp4Cmd = `"${ffmpegExe}" -y -i "${rawWebmPath}" -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -movflags +faststart "${outMp4Public}"`;
  execSync(ffmpegMp4Cmd, { stdio: 'inherit' });
  fs.copyFileSync(outMp4Public, outMp4Dist);
  console.log(`[FFMPEG] MP4 successfully generated at: ${outMp4Public} (${(fs.statSync(outMp4Public).size / 1024 / 1024).toFixed(2)} MB)`);

  // Extract Poster frame at 5 seconds
  console.log('[FFMPEG] Generating keyframe poster snapshot...');
  const ffmpegPosterCmd = `"${ffmpegExe}" -y -ss 00:00:05 -i "${outMp4Public}" -vframes 1 -q:v 2 "${outPoster}"`;
  execSync(ffmpegPosterCmd, { stdio: 'inherit' });
  fs.copyFileSync(outPoster, path.join(distVideosDir, 'demo-poster.png'));

  // Generate lightweight animated GIF preview (10 seconds sample, 15fps, 640px)
  console.log('[FFMPEG] Generating animated GIF preview for documentation...');
  const ffmpegGifCmd = `"${ffmpegExe}" -y -ss 00:00:08 -t 12 -i "${outMp4Public}" -vf "fps=12,scale=640:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse" "${outGif}"`;
  execSync(ffmpegGifCmd, { stdio: 'inherit' });
  fs.copyFileSync(outGif, path.join(distVideosDir, 'demo-preview.gif'));

  console.log('=== VIDEO SIMULATION COMPLETED SUCCESSFULLY! ===');
  console.log('Generated outputs:');
  console.log(' - MP4 Video: ' + outMp4Public);
  console.log(' - WebM Video: ' + outWebmPublic);
  console.log(' - Poster Image: ' + outPoster);
  console.log(' - Animated GIF: ' + outGif);
}

run().catch((err) => {
  console.error('[FATAL]', err);
  process.exit(1);
});
