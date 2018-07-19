function sort_table(){ 
 var getCellValue = function(tr, idx){ return tr.children[idx].innerText || tr.children[idx].textContent; }

	var comparer = function(idx, asc) { return function(a, b) { return function(v1, v2) {
			return v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2);
		}(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));
	}};

	// do the work...
	Array.from(document.querySelectorAll('th')).forEach(function(th) { th.addEventListener('click', function() {
			var table = th.closest('table');
			Array.from(table.querySelectorAll('tr:nth-child(n+2)'))
				.sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
				.forEach(function(tr) { table.appendChild(tr) });
			if($(this).hasClass("sort_col_sel"))
			  $(this).removeClass("sort_col_sel").addClass("sort_col_unsel");;                 
			$(this).addClass("sort_col_sel");   
		})
	});
}