const fs = require('fs');
const Packager = require('@turbowarp/packager');

(async () => {
    try {
        const sb_filename = process.env.SB_FILENAME || 'project.sb3';
        const output_filename = process.env.OUTPUT_FILENAME || 'my_game';
        
        console.log(`Loading project: ${sb_filename}`);
        const projectData = fs.readFileSync(sb_filename);
        const loadedProject = await Packager.loadProject(projectData);
        
        // Build HTML
        console.log("Building HTML...");
        const packagerHtml = new Packager.Packager();
        packagerHtml.project = loadedProject;
        packagerHtml.options.env = 'html';
        const resultHtml = await packagerHtml.package();
        fs.writeFileSync(`${output_filename}.html`, resultHtml.data);
        console.log(`Saved ${output_filename}.html`);

        // Build Windows EXE (electron-win32 works via zip or directly?)
        console.log("Building Windows EXE...");
        const packagerExe = new Packager.Packager();
        packagerExe.project = loadedProject;
        packagerExe.options.env = 'electron-win32';
        const resultExe = await packagerExe.package();
        fs.writeFileSync(`${output_filename}.zip`, resultExe.data);
        console.log(`Saved ${output_filename}.zip (Windows EXE package)`);
        
    } catch (e) {
        console.error("Packager error:", e);
        process.exit(1);
    }
})();