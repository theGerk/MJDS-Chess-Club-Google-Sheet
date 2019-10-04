/** Namespace for general functions concerning template sheets */
namespace TemplateSheets
{

	/**
	 * Deletes a sheet with a given name.
	 * 
	 * @param spreadsheet the spreadsheet to delete this sheet from
	 * @param sheetName Name of the sheet
	 * @returns true if a sheet is deleted, false otherwise
	 */
	function deleteSheet(spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet, sheetName: string): boolean
	{
		let sheet = spreadsheet.getSheetByName(sheetName);
		if(sheet)
		{
			spreadsheet.deleteSheet(sheet);
			return true;
		}
		else
			return false;
	}




	/**
	 * Creates a sheet from a template and populates n row with correct formating, formula, and data validations
	 *
	 * @param spreadsheet the spreadsheet we are working in (both template and output sheet are in this spreadsheet)
	 * @param template initial template sheet
	 * @param rows number of rows to generate
	 * @param sheetName the new sheet's name (optional)
	 * @param sheetIndex the new sheet's index (optional)
	 * @returns the generated sheet
	 */
	export function generate(spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet, template: GoogleAppsScript.Spreadsheet.Sheet, rows: number, sheetName?: string, sheetIndex?: number)
	{
		//Logger.log(`${template.getName()} - ${rows} on ${sheetName}.`);
		let sheet: GoogleAppsScript.Spreadsheet.Sheet;
		if(sheetName)
		{
			//delete any other sheet with this name
			deleteSheet(spreadsheet, sheetName);

			if(sheetIndex)
				sheet = spreadsheet.insertSheet(sheetName, sheetIndex, { template: template });
			else
				sheet = spreadsheet.insertSheet(sheetName, { template: template });
		}
		else
		{
			if(sheetIndex)
				sheet = spreadsheet.insertSheet(sheetIndex, { template: template });
			else
				sheet = spreadsheet.insertSheet({ template: template });
		}

		let range = sheet.getDataRange().offset(1, 0, 1);
		let columns = range.getNumColumns();
		let validations = range.getDataValidations()[0];
		let formulas = range.getFormulasR1C1()[0];
		range.setDataValidation(null);

		//adds rows
		if(rows > 1)
			sheet.insertRowsAfter(2, rows - 1);

		for(let col = 0; col < columns; col++)
		{
			let target = sheet.getRange(2, col + 1, rows);
			
			//formating
			range.getCell(1, col + 1).copyFormatToRange(sheet, col + 1, col + 1, 2, rows + 1);

			//formula
			let currentFormula = formulas[col];
			if(currentFormula)
				target.setFormulaR1C1(currentFormula);

			//data validation
			target.setDataValidation(validations[col]);
		}

		sheet.showSheet();
		sheet.addDeveloperMetadata("template", template.getSheetName());

		return sheet;
	}


}