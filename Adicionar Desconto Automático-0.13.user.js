// ==UserScript==
// @name         Adicionar Desconto Automático
// @namespace    http://your.site.namespace
// @version      0.13
// @description  Adiciona um desconto em todos os campos de desconto
// @author       Tiago Carneiro
// @match        https://portal.matuzi.pt/*
// @match        http://portal.matuzi.pt/*
// @match        https://www.portal.matuzi.pt/*
// @match        http://www.portal.matuzi.pt/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Função para adicionar o desconto em todos os campos
    function adicionarDesconto(valor) {
        var camposDesconto = document.querySelectorAll('input.desconto');
        camposDesconto.forEach(function(campo) {
            campo.value = valor;
        });
    }

    // Função para criar a caixa de diálogo e botão
    function criarInterface() {
        var container = document.createElement('div');
        container.id = 'desconto-interface'; // Adicionar um ID para fácil verificação
        container.style.textAlign = 'center';
        container.style.marginBottom = '10px';

        // Adicionar dois parágrafos antes da caixa de introdução
        var paragrafo1 = document.createElement('p');
        var paragrafo2 = document.createElement('p');

        // Criar a caixa de introdução menor
        var inputNumero = document.createElement('input');
        inputNumero.type = 'number';
        inputNumero.min = '0';
        inputNumero.max = '100';
        inputNumero.style.marginRight = '10px';
        inputNumero.style.width = '160px'; // Definir a largura para 160px

        // Criar o botão "Introduzir Descontos"
        var button = document.createElement('button');
        button.innerHTML = 'Introduzir Descontos';
        button.onclick = function() {
            var valor = inputNumero.value;
            adicionarDesconto(valor);
        };
        button.style.margin = '10px auto'; // Centralizar horizontalmente
        button.style.display = 'block';
        button.style.padding = '12px 24px';
        button.style.fontSize = '20px';
        button.style.fontWeight = 'bold';
        button.style.color = 'white';
        button.style.backgroundColor = 'rgb(8, 164, 196)';
        button.style.width = '200px';
        button.style.borderRadius = '12px';  // Add rounded corners

        // Adicionar elementos à caixa de interface
        container.appendChild(paragrafo1); // Adicionar primeiro parágrafo
        container.appendChild(paragrafo2); // Adicionar segundo parágrafo
        container.appendChild(inputNumero);
        container.appendChild(button);

        // Encontrar o elemento 'Items da Proposta' e inserir antes dele
        var itemsDaProposta = document.querySelector('td[align="center"][style*="border-top-right-radius"][style*="border-top-left-radius"]');
        if (itemsDaProposta) {
            var parentTable = itemsDaProposta.closest('table');
            parentTable.parentNode.insertBefore(container, parentTable);
        }
    }

    // Função para verificar se a interface já está carregada e, se não estiver, carregá-la
    function verificarEAdicionarInterface() {
        if (!document.getElementById('desconto-interface')) {
            criarInterface();
        }
    }

    // Intervalo para verificar e adicionar a interface, se necessário
    var checkInterval = setInterval(verificarEAdicionarInterface, 500);

    // Parar o intervalo após a interface ter sido carregada
    setTimeout(function() {
        clearInterval(checkInterval);
    }, 1000); // Verificar por até 3 segundos

})();
