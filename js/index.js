$(document).ready(function() {
	var currentInput = "0";
	var previousExpression = "";
	var maxDigits = 9;
	var error = false;
	
  $('button').click(function() {
		// Get selected button value
		selected = $(this).attr("value");
		console.log('selected: ' + selected);

		if (selected !== "=") {
			// Clear error if exists and/or set input to 0
			if (selected === "ac") {
				console.log("hello");
				error = false;
                $("#history").html("");
				$("#input-value").removeClass("blink");
				$("#input-value").html("0");
				currentInput = "0";
			}
			// Clear error if exists and/or set input to previous one
			else if (selected === "ce") {
				error = false;
				$("#input-value").removeClass("blink");
				$("#input-value").html("0");
                $("#history").html(currentInput);
				currentInput = "0";
			}
			// Overwrite 0 if entry is currently 'clear', but allow appending a decimal point
			else if(currentInput === "0" && selected !== ".") {
				currentInput = selected;
			}
			// Default case
			else {
				currentInput += selected;
			}
		}
		// Upon "=", compute result and display it immediately
		else {
			// Case where computation continues from history: append history to beginning
			// ONLY if computation continues (if first char is an arithmetic operator)
			var history = $("#history").html();
			var operators = ["*", "/", "+", "-"];
			var case1 = !operators.includes(history.charAt(history.length-1))
                && operators.includes(currentInput.charAt(0));
			var case2 = operators.includes(history.charAt(history.length-1))
                && !operators.includes(currentInput.charAt(0));
            if (history &&  (case1 || case2)) {
                console.log("happens");
            	currentInput = history + currentInput;
            }

			// Evaluate expression result and convert to sting for parsing
			var result = eval(currentInput).toString();
			// Parse into 2 strings: before & after decimal
			var beforeDecimal = result.split(".")[0];
			var afterDecimal = result.split(".")[1];
			// If digits after decimal exceed the limit, round the last digit
			// Keep in mind, can only perform this if since JS has short-circuit evaluation
			if (afterDecimal && afterDecimal.length > maxDigits - beforeDecimal) {
				// Desired result string without rounding yet
				afterDecimal = afterDecimal.slice(0, maxDigits - beforeDecimal.length);
				// Index of digit to change after rounding
				var index = afterDecimal.length - 1;
				// Round if the digit before that one >= 5
				if (afterDecimal.charAt(index - 1) >= 5) {
					var newDigit = parseInt(afterDecimal.charAt(index)) + 1;
					// The new rounded result
					afterDecimal = afterDecimal.substr(0, index) + newDigit;
				}
				// Join both strings together for rounded result
				result = beforeDecimal + "." + afterDecimal;
			}

			// Here we account for overflow error by checking if # digits 
			// before decimal exceed the limit 
			if (!beforeDecimal || beforeDecimal.length <= maxDigits) {
				currentInput = result;
			}
			// Exceeded! Show blinking error message until AC/CE.
			else {
				currentInput = "ERROR";
				error = true;
				$("#input-value").html(currentInput);
				$("#input-value").addClass("blink");
			}

			// Clear entry history after computation result
            $("#history").html("");
		}

		// Only allow adding to input if there isn't an error
		if (!error) {
			$("#input-value").html(currentInput);
		} 
	});
});