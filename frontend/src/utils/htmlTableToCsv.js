export const getCSV = () => {

			// Variable to store the final csv data
			var csv_data = [];

			// Get each row data
			var rows = document.getElementsByTagName('tr');
			for (var i = 0; i < rows.length; i++) {

				// Get each column data
				var cols = rows[i].querySelectorAll('td,th');

				// Stores each csv row data
				var csvrow = [];
                const skip_txt = ['Search: ', 'to'];
				for (var j = 0; j < cols.length; j++) {

                    

					// Get the text data of each cell
					// of a row and push it to csvrow

                    const data = cols[j].innerText;
                    console.log(data, typeof data)
                    if (!skip_txt.includes(data)) csvrow.push(cols[j].innerText);
				}

				// Combine each column value with comma
                if (cols.length !== 1) csv_data.push(csvrow.join(','));
			}

			// Combine each row data with new line character
			csv_data = csv_data.join('\n');

			// Create CSV file object and feed
			// our csv_data into it
			const CSVFile = new Blob([csv_data], {
				type: "text/csv"
			});

			// Create to temporary link to initiate
			// download process
			var temp_link = document.createElement('a');

			// Download csv file
			temp_link.download = "downloadedFile.csv";
			var url = window.URL.createObjectURL(CSVFile);
			temp_link.href = url;

			// This link should not be displayed
			temp_link.style.display = "none";
			document.body.appendChild(temp_link);

			// Automatically click the link to
			// trigger download
			temp_link.click();
			document.body.removeChild(temp_link);
		}
