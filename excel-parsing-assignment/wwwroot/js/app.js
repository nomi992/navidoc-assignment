
//document.getElementById('uploadBtn').addEventListener('click', function () {
//    const fileInput = document.getElementById('fileUpload');
//    const file = fileInput.files[0];

//    if (!file) {
//        alert("Please select a file.");
//        return;
//    }

//    const formData = new FormData();
//    formData.append('file', file);

//    fetch('/Report/UploadExcel', {
//        method: 'POST',
//        body: formData
//    })
//        .then(res => res.json())
//        .then(result => {
//            if (result.success) {
//                processExcel(file);
//            } else {
//                alert("Error: " + result.message);
//            }
//        })
//        .catch(err => {
//            console.error('Upload failed:', err);
//            alert("Upload failed.");
//        });
//});

//function processExcel(file) {
//    const reader = new FileReader();
//    reader.onload = function (e) {
//        const data = new Uint8Array(e.target.result);
//        const workbook = XLSX.read(data, { type: 'array' });
//        const sheet = workbook.Sheets[workbook.SheetNames[0]];
//        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
//        renderTable(jsonData);
//    };
//    reader.readAsArrayBuffer(file);
//}

//function renderTable(data) {
//    const container = document.getElementById('reportContainer');
//    container.innerHTML = ''; // Clear previous

//    const table = document.createElement('table');
//    table.className = 'report-table';
//    const thead = document.createElement('thead');
//    const tbody = document.createElement('tbody');
//    const controls = document.createElement('div');
//    controls.className = 'controls';

//    if (data.length === 0) return;

//    const headerRow = document.createElement('tr');

//    data[0].forEach((header, i) => {
//        const th = document.createElement('th');
//        const colId = `col-${i}`;
//        th.innerText = header || `Column ${i + 1}`;
//        th.setAttribute('data-column-id', colId);
//        th.draggable = true;

//        const resizer = document.createElement('div');
//        resizer.className = 'resizer';
//        th.appendChild(resizer);

//        headerRow.appendChild(th);

//        // Column toggle checkbox
//        const label = document.createElement('label');
//        const checkbox = document.createElement('input');
//        checkbox.type = 'checkbox';
//        checkbox.checked = true;
//        checkbox.setAttribute('data-column-id', colId);
//        checkbox.onchange = () => toggleColumnById(colId);
//        label.appendChild(checkbox);
//        label.appendChild(document.createTextNode(` ${header || `Column ${i + 1}`}`));
//        controls.appendChild(label);
//    });
//    thead.appendChild(headerRow);

//    data.slice(1).forEach(rowData => {
//        const row = document.createElement('tr');
//        data[0].forEach((_, colIndex) => {
//            const cell = document.createElement('td');
//            cell.innerText = rowData[colIndex] || '';
//            cell.setAttribute('data-column-id', `col-${colIndex}`);
//            row.appendChild(cell);
//        });
//        tbody.appendChild(row);
//    });

//    table.appendChild(thead);
//    table.appendChild(tbody);
//    container.appendChild(controls);
//    container.appendChild(table);

//    makeResizable(table);
//    makeDraggable(table);
//}

//function toggleColumnById(columnId) {
//    const table = document.querySelector('.report-table');
//    if (!table) return;

//    const allCells = table.querySelectorAll(`[data-column-id="${columnId}"]`);
//    allCells.forEach(cell => {
//        cell.classList.toggle('hidden-col');
//    });
//}
//window.toggleColumnById = toggleColumnById;

//function makeResizable(table) {
//    const headers = table.querySelectorAll('th');
//    headers.forEach((th, i) => {
//        const resizer = th.querySelector('.resizer');
//        if (!resizer) return;

//        let startX, startWidth;
//        resizer.addEventListener('mousedown', (e) => {
//            startX = e.pageX;
//            startWidth = th.offsetWidth;
//            document.documentElement.style.cursor = 'col-resize';

//            const onMouseMove = (eMove) => {
//                const newWidth = startWidth + (eMove.pageX - startX);
//                if (newWidth > 30) {
//                    th.style.width = newWidth + 'px';
//                    Array.from(table.rows).forEach(row => {
//                        if (row.cells[i]) row.cells[i].style.width = newWidth + 'px';
//                    });
//                }
//            };

//            const onMouseUp = () => {
//                document.documentElement.style.cursor = '';
//                document.removeEventListener('mousemove', onMouseMove);
//                document.removeEventListener('mouseup', onMouseUp);
//            };

//            document.addEventListener('mousemove', onMouseMove);
//            document.addEventListener('mouseup', onMouseUp);
//        });
//    });
//}

//function makeDraggable(table) {
//    let dragSrcIndex = null;

//    const headers = table.querySelectorAll('th');
//    headers.forEach((th, i) => {
//        th.addEventListener('dragstart', (e) => {
//            dragSrcIndex = i;
//            th.classList.add('dragging');
//            e.dataTransfer.effectAllowed = 'move';
//        });

//        th.addEventListener('dragend', () => {
//            th.classList.remove('dragging');
//            headers.forEach(h => h.classList.remove('drop-target'));
//        });

//        th.addEventListener('dragover', (e) => {
//            e.preventDefault();
//            if (i !== dragSrcIndex) th.classList.add('drop-target');
//        });

//        th.addEventListener('dragleave', () => {
//            th.classList.remove('drop-target');
//        });

//        th.addEventListener('drop', (e) => {
//            e.preventDefault();
//            th.classList.remove('drop-target');
//            if (i !== dragSrcIndex) moveColumn(table, dragSrcIndex, i);
//        });
//    });
//}

//function moveColumn(table, from, to) {
//    for (let row of table.rows) {
//        const cells = Array.from(row.children);
//        const cell = cells[from];
//        if (from < to) {
//            row.insertBefore(cell, cells[to + 1]);
//        } else {
//            row.insertBefore(cell, cells[to]);
//        }
//    }
//}
$(function () {
    $("#dialog").dialog({
        autoOpen: false,
        width: 1000,
        modal: true,
        resizable: true,
        open: function () {
            $("body").addClass("modal-open");
            $(".ui-dialog-titlebar-close").html("X");
        },
        close: function () {
            $("body").removeClass("modal-open");
        }
    });

    $('#uploadBtn').on('click', function () {
        const fileInput = document.getElementById('fileUpload');
        const file = fileInput.files[0];

        if (!file) {
            alert("Please select a file.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        fetch('/Report/UploadExcel', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(result => {
                if (result.success) {
                    processExcel(file);
                    $("#dialog").dialog("open");
                } else {
                    alert("Error: " + result.message);
                }
            })
            .catch(err => {
                console.error('Upload failed:', err);
                alert("Upload failed.");
            });
    });
});

function processExcel(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        renderTable(jsonData);
    };
    reader.readAsArrayBuffer(file);
}

function renderTable(data) {
    const container = document.getElementById('reportContainer');
    container.innerHTML = ''; // Clear previous

    const table = document.createElement('table');
    table.className = 'report-table';
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const controls = document.createElement('div');
    controls.className = 'controls';

    if (data.length === 0) return;

    const headerRow = document.createElement('tr');

    data[0].forEach((header, i) => {
        const th = document.createElement('th');
        const colId = `col-${i}`;
        th.innerText = header || `Column ${i + 1}`;
        th.setAttribute('data-column-id', colId);
        th.draggable = true;

        const resizer = document.createElement('div');
        resizer.className = 'resizer';
        th.appendChild(resizer);

        headerRow.appendChild(th);

        // Column toggle checkbox
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = true;
        checkbox.setAttribute('data-column-id', colId);
        checkbox.onchange = () => toggleColumnById(colId);
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${header || `Column ${i + 1}`}`));
        controls.appendChild(label);
    });
    thead.appendChild(headerRow);

    data.slice(1).forEach(rowData => {
        const row = document.createElement('tr');
        data[0].forEach((_, colIndex) => {
            const cell = document.createElement('td');
            cell.innerText = rowData[colIndex] || '';
            cell.setAttribute('data-column-id', `col-${colIndex}`);
            row.appendChild(cell);
        });
        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    container.appendChild(controls);
    container.appendChild(table);

    makeResizable(table);
    makeDraggable(table);
    //restoreColumnState(table); // ✅ Apply saved order/width/visibility
}

function toggleColumnById(columnId) {
    const checkboxes = document.querySelectorAll(`input[data-column-id="${columnId}"]`);
    const isChecked = checkboxes.length > 0 ? checkboxes[0].checked : true;

    const table = document.querySelector('.report-table');
    if (!table) return;

    const allCells = table.querySelectorAll(`[data-column-id="${columnId}"]`);
    allCells.forEach(cell => {
        if (isChecked) {
            cell.classList.remove('hidden-col');
        } else {
            cell.classList.add('hidden-col');
        }
    });

    persistColumnState(); // ✅ Save state
}
window.toggleColumnById = toggleColumnById;

function makeResizable(table) {
    const headers = table.querySelectorAll('th');
    headers.forEach((th, i) => {
        const resizer = th.querySelector('.resizer');
        if (!resizer) return;

        let startX, startWidth;
        resizer.addEventListener('mousedown', (e) => {
            startX = e.pageX;
            startWidth = th.offsetWidth;
            document.documentElement.style.cursor = 'col-resize';

            const onMouseMove = (eMove) => {
                const newWidth = startWidth + (eMove.pageX - startX);
                if (newWidth > 30) {
                    th.style.width = newWidth + 'px';
                    Array.from(table.rows).forEach(row => {
                        if (row.cells[i]) row.cells[i].style.width = newWidth + 'px';
                    });
                }
            };

            const onMouseUp = () => {
                document.documentElement.style.cursor = '';
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                //persistColumnState(); // ✅ Save width change
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    });
}

function makeDraggable(table) {
    let dragSrcIndex = null;

    const headers = table.querySelectorAll('th');
    headers.forEach((th, i) => {
        th.addEventListener('dragstart', (e) => {
            dragSrcIndex = i;
            th.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        });

        th.addEventListener('dragend', () => {
            th.classList.remove('dragging');
            headers.forEach(h => h.classList.remove('drop-target'));
        });

        th.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (i !== dragSrcIndex) th.classList.add('drop-target');
        });

        th.addEventListener('dragleave', () => {
            th.classList.remove('drop-target');
        });

        th.addEventListener('drop', (e) => {
            e.preventDefault();
            th.classList.remove('drop-target');
            if (i !== dragSrcIndex) {
                moveColumn(table, dragSrcIndex, i);
                persistColumnState(); // ✅ Save order change
            }
        });
    });
}

function moveColumn(table, from, to) {
    for (let row of table.rows) {
        const cells = Array.from(row.children);
        const cell = cells[from];
        if (from < to) {
            row.insertBefore(cell, cells[to + 1]);
        } else {
            row.insertBefore(cell, cells[to]);
        }
    }
}

//function persistColumnState() {
//    const headers = document.querySelectorAll('.report-table th');
//    const state = [];

//    headers.forEach((th, i) => {
//        const colId = th.getAttribute('data-column-id');
//        const width = th.offsetWidth;
//        const hidden = th.classList.contains('hidden-col');
//        state.push({ colId, index: i, width, hidden });
//    });

//    localStorage.setItem('columnState', JSON.stringify(state));
//}

//function restoreColumnState(table) {
//    const stateStr = localStorage.getItem('columnState');
//    if (!stateStr) return;

//    const state = JSON.parse(stateStr);
//    const colMap = {};

//    // Build map from current colId to <th>
//    const headers = table.querySelectorAll('th');
//    headers.forEach(th => {
//        const colId = th.getAttribute('data-column-id');
//        colMap[colId] = th;
//    });

//    state.forEach(({ colId, index, width, hidden }) => {
//        const th = colMap[colId];
//        if (!th) return;

//        // Set width
//        th.style.width = width + 'px';

//        // Reorder header
//        const parent = th.parentElement;
//        const current = Array.from(parent.children).indexOf(th);
//        if (current !== index) {
//            const cells = Array.from(table.rows).map(row => row.querySelector(`[data-column-id="${colId}"]`));
//            cells.forEach(cell => {
//                if (index < row?.children?.length) {
//                    row.insertBefore(cell, row.children[index]);
//                } else {
//                    row.appendChild(cell);
//                }
//            });
//        }

//        // Set hidden
//        const allCells = table.querySelectorAll(`[data-column-id="${colId}"]`);
//        allCells.forEach(cell => {
//            if (hidden) {
//                cell.classList.add('hidden-col');
//            } else {
//                cell.classList.remove('hidden-col');
//            }
//        });

//        // Also update checkbox
//        const checkbox = document.querySelector(`input[data-column-id="${colId}"]`);
//        if (checkbox) checkbox.checked = !hidden;
//    });

