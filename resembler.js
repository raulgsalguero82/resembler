const fs = require('fs-extra');
const compareImages = require("resemblejs/compareImages");
const cypress = require('cypress')


async function getDiff() {
	
	console.log('Starting cypress');
	await cypress.run();
	console.log('Finished cypress');


	var now = new Date();
	let refNames=now.getFullYear() + "-"+ now.getMonth() + "-" + now.getDate()+ "-" + now.getHours() + "-" + now.getMinutes()+"-"+ now.getMilliseconds()+"-";	
	
	console.log('RefName: '+refNames);
	
	console.log('Starting resemblejs');
    const options = {
        output: {
            errorColor: {
                red: 255,
                green: 0,
                blue: 255
            },
            errorType: "movement",
            transparency: 0.3,
            largeImageThreshold: 1200,
            useCrossOrigin: false,
            outputDiff: true
        },
        scaleToSameSize: true,
        ignore: "antialiasing"
    };
	
	const data = await compareImages(
        await fs.readFile("screenshotsFolder/regresion.js/baseState.png"),
        await fs.readFile("screenshotsFolder/regresion.js/afterState.png"),
        options
    );
	let resultInfo = 
            "isSameDimensions: "+data.isSameDimensions+"</br>"+
            "dimensionDifference: "+ JSON.stringify(data.dimensionDifference)+"</br>"+
            "rawMisMatchPercentage: "+ data.rawMisMatchPercentage+"</br>"+
            "misMatchPercentage: "+ data.misMatchPercentage+"</br>"+
            "diffBounds: "+ JSON.stringify(data.diffBounds)+"</br>"+
            "analysisTime: "+data.analysisTime;
 
     await fs.writeFile("results/images/"+refNames+"diff.png", data.getBuffer());	
	 
	console.log('Finished resemblejs');
	console.log('Moving results...');
	fs.moveSync('screenshotsFolder/regresion.js/baseState.png', 'results/images/'+refNames+'before.png');
	fs.moveSync('screenshotsFolder/regresion.js/afterState.png', 'results/images/'+refNames+'after.png');


	
	try {
		var htmlFile = fs.readFileSync('results/index.html', 'utf8');		
	} catch(e) {
		console.log('Error:', e.stack);
	}
	
	let rowModel='<hr><div class="row"><div class="col-lg-1 col-md-12"><b>@1</b></div><div class="col-lg-3 col-md-4 text-center"><h3>Paso 0: Estado inicial</h3>@2</div><div class="col-lg-3 col-md-4 text-center"><h3>Paso 1: Click en boton #generate</h3>@3</div><div class="col-lg-3 col-md-4 text-center"><h3>Imagen de comparación</h3>@4</div><div class="col-lg-2 col-md-12"><h3>Estadística de Resemble</h3>@5</div></div>';
	
	rowModel=rowModel.replace(/@1/i,now);
	rowModel=rowModel.replace(/@2/i,"<img src='images/"+refNames+"before.png' class='imageFormat' /> <a target='_blank' href='images/"+refNames+"before.png'>Zoom</a> ");
	rowModel=rowModel.replace(/@3/i,"<img src='images/"+refNames+"after.png' class='imageFormat' /> <a  target='_blank' href='images/"+refNames+"after.png'>Zoom</a>");
	rowModel=rowModel.replace(/@4/i,"<img src='images/"+refNames+"diff.png' class='imageFormat' /><a  target='_blank' href='images/"+refNames+"diff.png'>Zoom</a> ");
	rowModel=rowModel.replace(/@5/i,resultInfo);
	rowModel+="\n<!--ReplaceThis-->";
	
	htmlFile=htmlFile.replace(/<!--ReplaceThis-->/i , rowModel);
	
	fs.writeFileSync('results/index.html',htmlFile, 'utf8');
	

	console.log('Done');
}



getDiff();