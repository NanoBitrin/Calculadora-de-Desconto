// ==UserScript==
// @name         Observações de Cálculo
// @namespace    http://tampermonkey.net/
// @version      v2.37
// @description  Este script preenche automaticamente o campo de Observações com o valor diluído das caixas para unidades/kg/lt/etc. Ele busca dados externos em um arquivo JSON e realiza os cálculos com base nas informações encontradas. Facilita o processo de preenchimento de propostas, proporcionando maior agilidade e precisão nas observações.
// @author       Tiago Carneiro
// @match        https://portal.matuzi.pt/*
// @match        http://portal.matuzi.pt/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // Function to decode HTML entities
    function decodeHTMLEntities(text) {
        var textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    }

    // Function to fetch the external JSON file
    function fetchJSON() {
        var url = 'https://raw.githubusercontent.com/NanoBitrin/Calculadora-de-Desconto/main/mtzdata.json';
        // Adiciona um parÃ¢metro de timestamp Ã  URL
        url += '?timestamp=' + new Date().getTime();

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                var productsData = JSON.parse(response.responseText);
                updateObservations(productsData.Sheet1);  // Pass the Sheet1 data to the function
            }
        });
    }

    // Function to update observations with the units per crate value
    function updateObservations(productsData) {
        var productRows = document.querySelectorAll('.linha.border_bottomw');

        for (var i = 0; i < productRows.length; i++) {
            var observationInput = productRows[i].querySelector('.form-control.observacoes');
            var productNameElement = productRows[i].querySelector('td:nth-child(2)');
            var productPriceElement = productRows[i].querySelector('.form-control.preco'); // Get the price element
            var productDiscountElement = productRows[i].querySelector('.form-control.desconto'); // Get the discount element

            if (productNameElement == null || productPriceElement == null || productDiscountElement == null) {
                console.log('Cannot find the product name, price, or discount element in row', i, 'with data-id', productRows[i].getAttribute('data-id'));
                continue;
            }

            var productName = decodeHTMLEntities(productNameElement.innerHTML.split('<br>')[0].trim()); // Decode HTML entities
            var productBasePrice = parseFloat(productPriceElement.getAttribute('preco')); // Use the preco attribute as the base price
            var productDiscount = parseFloat(productDiscountElement.value); // Parse the discount as a float
            var unitsPerCrate = '';
            var nomeCalculo = '';

            var matchFound = false;
            for (var j = 0; j < productsData.length; j++) {
                var product = productsData[j];
                var name = product.Name.trim();
                if (productName === name) {
                    unitsPerCrate = parseFloat(product['Unidade calculo']); // Parse the units per crate as a float
                    nomeCalculo = product['Nome calculo']; // Get the "Nome calculo" value
                    console.log('Match found:', name);
                    matchFound = true;
                    break;
                }
            }

            console.log('Units per Crate:', unitsPerCrate);

            if (!isNaN(productBasePrice) && !isNaN(productDiscount)) {
                var discountedPrice = productBasePrice - (productBasePrice * productDiscount / 100); // Calculate the discounted price
                productPriceElement.value = discountedPrice.toFixed(2); // Update the price field with the discounted price
            }

            if (unitsPerCrate && !isNaN(productBasePrice)) {
                var result = discountedPrice / unitsPerCrate;
                observationInput.value = result.toFixed(3) + nomeCalculo; // Append the "Nome calculo" to the result
            } else {
                console.log('No match found for:', productName);
            }

            if (matchFound) {
                continue;
            }
        }
    }

    // Create the button and attach the fetchJSON function to its click event
    var button = document.createElement('button');
    button.innerHTML = 'Calcular Observações';
    button.onclick = fetchJSON;
    button.style.margin = '10px auto';
    button.style.display = 'block';
    button.style.padding = '12px 24px';
    button.style.fontSize = '20px';
    button.style.fontWeight = 'bold';
    button.style.color = 'white';
    button.style.backgroundColor = 'rgb(8, 164, 196)';
    button.style.width = '200px';
    button.style.borderRadius = '12px';  // Add rounded corners

    // Create a div container to center the button
    var buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'center';
    buttonContainer.appendChild(button);

    var proposalElement;
    var intervalId;

    function addButtonIfPossible() {
        if (!proposalElement && document.getElementById('proposta')) {
            proposalElement = document.getElementById('proposta');
            // Insert the button container as the first child of the "proposta" element
            proposalElement.insertBefore(buttonContainer, proposalElement.firstChild);
            // If the button has been added, clear the interval
            clearInterval(intervalId);
        }
    }

    // Check every 500 milliseconds
    intervalId = setInterval(addButtonIfPossible, 500);
})();