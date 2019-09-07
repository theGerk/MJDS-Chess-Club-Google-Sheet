/// <reference path="Constants.ts"/>


function transposeSheet()
{
	var u = SpreadsheetApp.getUi();
	var s = SpreadsheetApp.getActive().getSheetByName('DEVSHEET');
	var v = s.getDataRange().getValues();
	var n = [];
	for(var i = 0; i < v[0].length; i++)
	{
		n.push([]);
		for(var j = 0; j < v.length; j++)
			n[i].push(v[j][i]);
	}
	s.getRange(1, 1, n.length, n[0].length).setValues(n);
}


function thisfunc()
{
	Logger.log("this just worked");
	throw new Error("Hello benji's inbox.");
}

function initialzeSheetFromInitalDataInitially()
{
	initialize({ "Quinn Olson": { "grade": 7, "name": "Quinn Olson", "group": "", "rating": 966, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 0, "wins_updated": [] }, "Vanya Kase": { "grade": 9, "name": "Vanya Kase", "group": "", "rating": 1000, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 1, "wins_updated": [] }, "Elizabeth Madigan": { "grade": 11, "name": "Elizabeth Madigan", "group": "", "rating": 997, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 2, "wins_updated": [] }, "Jordyn Deschamps": { "grade": 10, "name": "Jordyn Deschamps", "group": "", "rating": 1299, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 3, "wins_updated": [] }, "Heidi Mintz": { "grade": 10, "name": "Heidi Mintz", "group": "", "rating": 891, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 4, "wins_updated": [] }, "Amarah McDonough": { "grade": 11, "name": "Amarah McDonough", "group": "", "rating": 1017, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 5, "wins_updated": [] }, "Jack Mintz": { "grade": 9, "name": "Jack Mintz", "group": "", "rating": 781, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 6, "wins_updated": [] }, "Nathan Posada": { "grade": 9, "name": "Nathan Posada", "group": "", "rating": 1000, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 7, "wins_updated": [] }, "Delaney Fogel": { "grade": 9, "name": "Delaney Fogel", "group": "", "rating": 1505, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 8, "wins_updated": [] }, "David Kopilenko": { "grade": 7, "name": "David Kopilenko", "group": "", "rating": 894, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 9, "wins_updated": [] }, "Gabriel Wear": { "grade": 8, "name": "Gabriel Wear", "group": "", "rating": 1064, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 10, "wins_updated": [] }, "Tim McGlennon": { "grade": 7, "name": "Tim McGlennon", "group": "D", "rating": 1000, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 11, "wins_updated": [] }, "Benjamin Boudewyns": { "grade": 7, "name": "Benjamin Boudewyns", "group": "D", "rating": 1000, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 12, "wins_updated": [] }, "Leo Kaplan": { "grade": 8, "name": "Leo Kaplan", "group": "D", "rating": 1000, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 13, "wins_updated": [] }, "Nechama Buchbinder": { "grade": "A", "name": "Nechama Buchbinder", "group": "C", "rating": 949, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 14, "wins_updated": [] }, "Alex Harris": { "grade": 11, "name": "Alex Harris", "group": "D", "rating": 1000, "wins_original": ["W-Eli ", "W-Haya", "", "", "", "", "", "", ""], "row": 15, "wins_updated": ["Eli Notkin 1", "Haya Fine 1"] }, "Shira Aronow": { "grade": 11, "name": "Shira Aronow", "group": "D", "rating": 1150, "wins_original": ["W-Emma", "", "", "", "", "", "", "", ""], "row": 16, "wins_updated": ["Emma Samuels 1"] }, "Emma Samuels": { "grade": 9, "name": "Emma Samuels", "group": "D", "rating": 820, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 17, "wins_updated": [] }, "Alexis Horowitz": { "grade": 11, "name": "Alexis Horowitz", "group": "D", "rating": 1334, "wins_original": ["David P", "W-Ari KR", "", "", "", "", "", "", ""], "row": 18, "wins_updated": ["David Prohofsky 1", "Ari Kaner-Roth 1"] }, "Ari Braverman": { "grade": 11, "name": "Ari Braverman", "group": "C", "rating": 1000, "wins_original": ["W-Ari KR", "David P", "w-Elias", "", "", "", "", "", ""], "row": 19, "wins_updated": ["Ari Kaner-Roth 1", "David Prohofsky 1", "Elias Barshteyn 1"] }, "Ryan Prohofsky": { "grade": 9, "name": "Ryan Prohofsky", "group": "D", "rating": 985, "wins_original": ["W-Eli ", "", "", "", "", "", "", "", ""], "row": 20, "wins_updated": ["Eli Notkin 1"] }, "Haya Fine": { "grade": 10, "name": "Haya Fine", "group": "D", "rating": 1275, "wins_original": ["W-Ari B", "W-Noah O", "", "", "", "", "", "", ""], "row": 21, "wins_updated": ["Ari Braverman 1", "Noah Orloff 1"] }, "David Prohofsky": { "grade": 12, "name": "David Prohofsky", "group": "C", "rating": 1251, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 22, "wins_updated": [] }, "Yaakov Buchbinder": { "grade": 11, "name": "Yaakov Buchbinder", "group": "B", "rating": 1551, "wins_original": ["W-Arlo", "W-Zeke", "", "", "", "", "", "", ""], "row": 23, "wins_updated": ["Arlo Cornell 1", "Ezekiel Rischall 1"] }, "Abie Harris": { "grade": 7, "name": "Abie Harris", "group": "D", "rating": 920, "wins_original": ["W-Isaac", "", "", "", "", "", "", "", ""], "row": 24, "wins_updated": ["Isaac Lower 1"] }, "Aodhtan Gross": { "grade": "A", "name": "Aodhtan Gross", "group": "B", "rating": 1474, "wins_original": ["W-Isaac", "Arlo", "", "", "", "", "", "", ""], "row": 25, "wins_updated": ["Isaac Lower 1", "Arlo Cornell 1"] }, "Thason Benson": { "grade": 6, "name": "Thason Benson", "group": "D", "rating": 819, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 26, "wins_updated": [] }, "Marissa Rischal": { "grade": 6, "name": "Marissa Rischal", "group": "D", "rating": 786, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 27, "wins_updated": [] }, "Eli Notkin": { "grade": 10, "name": "Eli Notkin", "group": "C", "rating": 1000, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 28, "wins_updated": [] }, "Isaac Lower": { "grade": 8, "name": "Isaac Lower", "group": "C", "rating": 882, "wins_original": ["W-Aidan", "Micah", "W-Eli ", "", "", "", "", "", ""], "row": 29, "wins_updated": ["Aidan Shafton 1", "Micah Schoenberger 1", "Eli Notkin 1"] }, "Bril Asraf": { "grade": 8, "name": "Bril Asraf", "group": "D", "rating": 766, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 30, "wins_updated": [] }, "Isa Kaner-Roth": { "grade": 9, "name": "Isa Kaner-Roth", "group": "C", "rating": 892, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 31, "wins_updated": [] }, "Ari Sellers": { "grade": 6, "name": "Ari Sellers", "group": "D", "rating": 556, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 32, "wins_updated": [] }, "Noam Halpern": { "grade": 8, "name": "Noam Halpern", "group": "D", "rating": 917, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 33, "wins_updated": [] }, "Ilan Schein": { "grade": 6, "name": "Ilan Schein", "group": "D", "rating": 509, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 34, "wins_updated": [] }, "Noah Orloff": { "grade": 11, "name": "Noah Orloff", "group": "C", "rating": 1165, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 35, "wins_updated": [] }, "Elias Barshteyn": { "grade": 11, "name": "Elias Barshteyn", "group": "C", "rating": 1010, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 36, "wins_updated": [] }, "Malachi Gross": { "grade": 8, "name": "Malachi Gross", "group": "C", "rating": 1360, "wins_original": ["Asher Sindt, ", "", "Ben Lubka", "", "Meyer Zis", "", "Alexander", "", "Gabe Krug"], "row": 37, "wins_updated": ["Asher Sindt 1", "Ben Lubka 1", "Meyer Zis 1", "Alexander Geretz 1", "Gabe Krug 1"] }, "Eliora Estrin": { "grade": 5, "name": "Eliora Estrin", "group": "D", "rating": 568, "wins_original": ["Arash", "", "", "", "", "", "", "", ""], "row": 38, "wins_updated": ["Arash Mahipal 1"] }, "Henry Salita": { "grade": 8, "name": "Henry Salita", "group": "D", "rating": 864, "wins_original": ["", "", "Aiden Blumenfield", "", "", "", "", "", ""], "row": 39, "wins_updated": ["Aiden Blumenfield 1"] }, "Sam Grodnick": { "grade": 9, "name": "Sam Grodnick", "group": "C", "rating": 1201, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 40, "wins_updated": [] }, "Ellie Grodnick": { "grade": 9, "name": "Ellie Grodnick", "group": "C", "rating": 1082, "wins_original": ["", "", "Ben Lubka", "", "", "", "", "", ""], "row": 41, "wins_updated": ["Ben Lubka 1"] }, "Josh Bagley": { "grade": 8, "name": "Josh Bagley", "group": "C", "rating": 829, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 42, "wins_updated": [] }, "Jack Grodnick": { "grade": 10, "name": "Jack Grodnick", "group": "C", "rating": 1287, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 43, "wins_updated": [] }, "Gabe Krug": { "grade": 8, "name": "Gabe Krug", "group": "C", "rating": 834, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 44, "wins_updated": [] }, "Aaron Woodman": { "grade": 8, "name": "Aaron Woodman", "group": "C", "rating": 884, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 45, "wins_updated": [] }, "Aidan Shafton": { "grade": 8, "name": "Aidan Shafton", "group": "C", "rating": 1047, "wins_original": ["", "", "Asher Sindt", "", "", "", "", "", ""], "row": 46, "wins_updated": ["Asher Sindt 1"] }, "Joshua Madigan": { "grade": 9, "name": "Joshua Madigan", "group": "C", "rating": 1105, "wins_original": ["", "Micah", "Alexander G", "", "", "", "", "", ""], "row": 47, "wins_updated": ["Micah Schoenberger 1", "Alexander Geretz 1"] }, "Solomon Lubka": { "grade": 8, "name": "Solomon Lubka", "group": "C", "rating": 1076, "wins_original": ["", "1 Zavdi", "", "2 Meyer", "", "", "", "", ""], "row": 48, "wins_updated": ["Zavdi Fisher 1", "Meyer Zis 2"] }, "Neev Benjamin-Fink": { "grade": 4, "name": "Neev Benjamin-Fink", "group": "D", "rating": 675, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 49, "wins_updated": [] }, "Ari Kaner-Roth": { "grade": 11, "name": "Ari Kaner-Roth", "group": "A", "rating": 1802, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 50, "wins_updated": [] }, "Atara Marmor": { "grade": 4, "name": "Atara Marmor", "group": "D", "rating": 535, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 51, "wins_updated": [] }, "Oliver Salita": { "grade": 8, "name": "Oliver Salita", "group": "C", "rating": 871, "wins_original": ["", "Zavdi", "", "", "", "", "", "", ""], "row": 52, "wins_updated": ["Zavdi Fisher 1"] }, "Micah Schoenberger": { "grade": 8, "name": "Micah Schoenberger", "group": "C", "rating": 1128, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 53, "wins_updated": [] }, "Kalman Greenberger": { "grade": 11, "name": "Kalman Greenberger", "group": "C", "rating": 940, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 54, "wins_updated": [] }, "Arlo Cornell": { "grade": 9, "name": "Arlo Cornell", "group": "A", "rating": 1334, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 55, "wins_updated": [] }, "Ezekiel Rischall": { "grade": 8, "name": "Ezekiel Rischall", "group": "A", "rating": 1767, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 56, "wins_updated": [] }, "Aiden Blumenfield": { "grade": 5, "name": "Aiden Blumenfield", "group": "C", "rating": 924, "wins_original": ["", "Zavdi", "Reuben Bukstein", "", "", "", "", "", ""], "row": 57, "wins_updated": ["Zavdi Fisher 1", "Reuben Bukstein 1"] }, "Kai Shemesh": { "grade": "K", "name": "Kai Shemesh", "group": "D", "rating": 930, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 58, "wins_updated": [] }, "Sivan Wallace": { "grade": 5, "name": "Sivan Wallace", "group": "D", "rating": 809, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 59, "wins_updated": [] }, "Chyna LarkinsLott": { "grade": "A", "name": "Chyna LarkinsLott", "group": "", "rating": 1418, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 60, "wins_updated": [] }, "Chava Buchbinder": { "grade": "A", "name": "Chava Buchbinder", "group": "B", "rating": 1359, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 61, "wins_updated": [] }, "Shoshi Altman": { "grade": "A", "name": "Shoshi Altman", "group": "A", "rating": 2118, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 62, "wins_updated": [] }, "Milton Vlosky": { "grade": 2, "name": "Milton Vlosky", "group": "D", "rating": 838, "wins_original": ["", "", "Reuben Bukstein", "", "", "", "", "", ""], "row": 63, "wins_updated": ["Reuben Bukstein 1"] }, "Evan Levy": { "grade": 7, "name": "Evan Levy", "group": "D", "rating": 850, "wins_original": ["", "", "", "", "Jake Hororitz", "", "", "", ""], "row": 64, "wins_updated": ["Jake Hororitz 1"] }, "Sammy Davis Jacob": { "grade": 7, "name": "Sammy Davis Jacob", "group": "C", "rating": 990, "wins_original": ["", "", "", "", "Jake Hororitz", "", "", "", ""], "row": 65, "wins_updated": ["Jake Hororitz 1"] }, "Alexander Geretz": { "grade": 8, "name": "Alexander Geretz", "group": "C", "rating": 1034, "wins_original": ["", "", "Robby Gendlin", "", "", "", "", "", ""], "row": 66, "wins_updated": ["Robby Gendlin 1"] }, "Rafi Ludoimrsky": { "grade": 4, "name": "Rafi Ludoimrsky", "group": "D", "rating": 944, "wins_original": ["", "", "", "", "Zavdi Fisher", "", "", "", ""], "row": 67, "wins_updated": ["Zavdi Fisher 1"] }, "Avital Krebs": { "grade": 6, "name": "Avital Krebs", "group": "C", "rating": 1306, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 68, "wins_updated": [] }, "Asher Sindt": { "grade": 8, "name": "Asher Sindt", "group": "C", "rating": 1488, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 69, "wins_updated": [] }, "Ezra Awend": { "grade": 3, "name": "Ezra Awend", "group": "C", "rating": 1225, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 70, "wins_updated": [] }, "Jake Hororitz": { "grade": 3, "name": "Jake Hororitz", "group": "C", "rating": 1206, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 71, "wins_updated": [] }, "Arash Mahipal": { "grade": 5, "name": "Arash Mahipal", "group": "C", "rating": 1177, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 72, "wins_updated": [] }, "Arav Mahipal": { "grade": 3, "name": "Arav Mahipal", "group": "C", "rating": 1066, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 73, "wins_updated": [] }, "Eitan Wallace": { "grade": 2, "name": "Eitan Wallace", "group": "C", "rating": 1136, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 74, "wins_updated": [] }, "Reuben Bukstein": { "grade": 3, "name": "Reuben Bukstein", "group": "C", "rating": 894, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 75, "wins_updated": [] }, "Abe Zis": { "grade": 3, "name": "Abe Zis", "group": "C", "rating": 1003, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 76, "wins_updated": [] }, "Meyer Zis": { "grade": 6, "name": "Meyer Zis", "group": "B", "rating": 1050, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 77, "wins_updated": [] }, "Heschel Fisher": { "grade": 1, "name": "Heschel Fisher", "group": "D", "rating": 724, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 78, "wins_updated": [] }, "Ryan Steinberg": { "grade": 7, "name": "Ryan Steinberg", "group": "A", "rating": 1787, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 79, "wins_updated": [] }, "Kina Koshiol": { "grade": 1, "name": "Kina Koshiol", "group": "D", "rating": 730, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 80, "wins_updated": [] }, "Andrew Steinberg": { "grade": 7, "name": "Andrew Steinberg", "group": "B", "rating": 1525, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 81, "wins_updated": [] }, "Ben Rogovin": { "grade": 2, "name": "Ben Rogovin", "group": "D", "rating": 854, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 82, "wins_updated": [] }, "Liat Ryaboy": { "grade": 1, "name": "Liat Ryaboy", "group": "D", "rating": 632, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 83, "wins_updated": [] }, "Saul Zis": { "grade": 8, "name": "Saul Zis", "group": "B", "rating": 1510, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 84, "wins_updated": [] }, "Zavdi Fisher": { "grade": 6, "name": "Zavdi Fisher", "group": "C", "rating": 966, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 85, "wins_updated": [] }, "Robby Gendlin": { "grade": 10, "name": "Robby Gendlin", "group": "C", "rating": 1278, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 86, "wins_updated": [] }, "Amichai Davis": { "grade": 6, "name": "Amichai Davis", "group": "C", "rating": 878, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 87, "wins_updated": [] }, "Michelle Kenigsberg": { "grade": 7, "name": "Michelle Kenigsberg", "group": "D", "rating": 778, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 88, "wins_updated": [] }, "Gev Avny": { "grade": 1, "name": "Gev Avny", "group": "D", "rating": 1000, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 89, "wins_updated": [] }, "Benny Marmor": { "grade": 6, "name": "Benny Marmor", "group": "D", "rating": 917, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 90, "wins_updated": [] }, "Benji Altman": { "grade": "A", "name": "Benji Altman", "group": "", "rating": 1000, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 91, "wins_updated": [] }, "Ben Lubka": { "grade": "A", "name": "Ben Lubka", "group": "", "rating": 1545, "wins_original": ["", "", "", "", "", "", "", "", ""], "row": 92, "wins_updated": [] } });
}
/**
 * Generates the entire master list from an input object, should never be used again.
 * @param inputObj
 */
function initialize(inputObj: { [str: string]: { grade: number | string, group: string, name: string, rating: number, wins_updated: string[], wins_original: string[], row: number } }): void
{
	let output: any[][] = [];
	for(let current in inputObj)
	{
		let c = inputObj[current];
		let row = [];
		row[CONST.pages.master.columns.gamesPlayed] = 0;
		row[CONST.pages.master.columns.grade] = c.grade;
		row[CONST.pages.master.columns.group] = c.group;
		row[CONST.pages.master.columns.lampertRating] = c.rating;
		row[CONST.pages.master.columns.name] = c.name;
		row[CONST.pages.master.columns.storedWins] = c.wins_updated.join(CONST.pages.master.storedWinSeperator);
		row[CONST.pages.master.columns.glickoRating] = null;
		row[CONST.pages.master.columns.glickoRatingDeviation] = null;
		row[CONST.pages.master.columns.glickoRatingVariance] = null;
		output.push(row);
	}
	SpreadsheetApp.getActive().getSheetByName(CONST.pages.master.name).getRange(2, 1, output.length, output[0].length).setValues(output);
}

function testRatings()
{
	let activeData = FrontEnd.getActivePlayerData();
	let games = FrontEnd.getGamesPlayedData();

	let data: { [name: string]: Lampert.IRating } = {};
	for(let i = 0; i < activeData.length; i++)
	{
		let current = activeData[i];
		data[current.name] = { rating: current.lampertRating };
	}

	let s = SpreadsheetApp.getActive();
	let output1: any[][] = [['winner', 'old rating', 'new rating', 'looser','old rating', 'new rating']]
	for(let i = 0; i < games.length; i++)
	{
		let current = games[i];
		let t1 = data[current.white].rating;
		let t2 = data[current.black].rating;
		Lampert.match(data[current.white], data[current.black], current.result);
		output1.push([current.white, t1, data[current.white].rating, current.black, t2, data[current.black].rating]);
	}
	s.getSheetByName('by game').getRange(1, 1, output1.length, output1[0].length).setValues(output1);

	let sum = 0;
	let count = 0;
	for(let name in data)
	{
		sum += data[name].rating;
		count++;
	}
	let output: any[][] = [['name', 'computer']];
	for(let name in data)
	{
		output.push([name, data[name].rating]);
	}
	s.getSheetByName('ratings').getRange(1, 1, output.length, output[0].length).setValues(output);
}

function testFunction()
{
	redoAsIs(true);
}

function redoAsIs(write?: boolean)
{
	let club = FrontEnd.getClub();
	FrontEnd.setClub(club, write);
}