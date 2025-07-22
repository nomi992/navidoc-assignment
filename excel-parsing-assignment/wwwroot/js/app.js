$(document).ready(function () {
    // Handle file upload
    $('#uploadBtn').on('click', function () {
        var formData = new FormData();
        var file = $('#fileUpload')[0].files[0];
        formData.append('file', file);

        $.ajax({
            url: '/Report/UploadExcel',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function (response) {
                if (response.success) {
                    displayReport(response.data);
                } else {
                    alert('File upload failed: ' + response.message);
                }
            }
        });
    });

    // Display the report in a table
    function displayReport(data) {
        var table = $('<table>').addClass('report-table');
        var thead = $('<thead>');
        var tbody = $('<tbody>');
        var headerRow = $('<tr>');

        // Add headers
        if (data.length > 0) {
            Object.keys(data[0]).forEach(function (key) {
                var th = $('<th>').text(key).attr('data-column', key);
                headerRow.append(th);
            });
            thead.append(headerRow);

            // Add rows
            data.forEach(function (row) {
                var tr = $('<tr>');
                Object.values(row).forEach(function (value) {
                    var td = $('<td>').text(value);
                    tr.append(td);
                });
                tbody.append(tr);
            });

            table.append(thead).append(tbody);
            $('#reportContainer').html(table);

            makeColumnsResizable();
            makeColumnsDraggable();
        }
    }

    // Make columns resizable
    function makeColumnsResizable() {
        $('.report-table th').resizable({
            handles: 'e',
            minWidth: 50
        });
    }

    // Make columns draggable
    function makeColumnsDraggable() {
        $('.report-table thead').sortable({
            items: 'th',
            cursor: 'move',
            axis: 'x',
            stop: function (event, ui) {
                var columns = [];
                $('.report-table th').each(function () {
                    columns.push($(this).data('column'));
                });
                console.log('Column order:', columns); // Save the order
            }
        });
    }
});
