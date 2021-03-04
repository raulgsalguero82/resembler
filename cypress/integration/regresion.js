const compareImages = require("resemblejs/compareImages");
const fs = require('fs');
const path = require('path');

describe('My First Test', () => {
  it('Does not do much!', () => {
    cy.visit('https://raulgsalguero82.github.io/')
	debugger
	DoOperate();
  })
})


function DoOperate()
{
	let baseStatePath='';
	let afterStatePath='';
	cy.screenshot('baseState', {
		  onAfterScreenshot ($el, props) {
			  baseStatePath=props.path;
		  }
		});
		
		let generateButton='#generate';	
	

		var button=cy.get(generateButton);		
		button.click();								
	
		cy.wait(300);
		
	
	cy.screenshot('afterState', {
		  onAfterScreenshot ($el, props) {

		  },
		});
	
	
}

