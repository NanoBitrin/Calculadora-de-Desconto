// ==UserScript==
// @name         Calculadora de Desconto
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Calculadora de desconto
// @author       Tiago Carneiro
// @match        https://portal.matuzi.pt/*
// @match        http://portal.matuzi.pt/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Função para calcular o desconto
    function calcularDesconto(precoInicial, precoComDesconto, unidadesPorCaixa) {
        const desconto = ((precoInicial / unidadesPorCaixa - precoComDesconto) / (precoInicial / unidadesPorCaixa)) * 100;
        return desconto.toFixed(2);
    }

    // Função para criar a calculadora de desconto
    function criarCalculadora() {
        const calculadoraHTML = `
            <div class="calculadora-desconto" style="width: 160px; text-align: center;">
                <p style="font-weight: bold; margin: 0;">Calculadora de Descontos</p>
                <label style="display: block; margin: 5px 0;">Preço Inicial:</label>
                <input type="number" class="preco-inicial" style="width: 100px; text-align: right; vertical-align: middle;" value="">
                <label style="display: block; margin: 5px 0;">Unidades por Caixa:</label>
                <input type="number" class="unidades-por-caixa" style="width: 100px; text-align: right; vertical-align: middle;" value="1">
                <label style="display: block; margin: 5px 0;">Desconto (%):</label>
                <input type="number" class="desconto-calculadora" style="width: 100px; text-align: right; vertical-align: middle;" value="">
                <label style="display: block; margin: 5px 0;">Preço c/desconto:</label>
                <input type="number" class="preco-com-desconto" style="width: 100px; text-align: right; vertical-align: middle;" value="">
                <button class="limpar-campos">Limpar</button>
            </div>
        `;

        const tabelaItens = document.querySelector('.html_linhaproposta');
        if (tabelaItens) {
            tabelaItens.insertAdjacentHTML('beforebegin', calculadoraHTML);
            const botaoLimpar = document.querySelector('.limpar-campos');
            botaoLimpar.addEventListener('click', limparCampos);
        }
    }

    // Função para adicionar eventos aos campos de entrada
    function adicionarEventos() {
        const camposDesconto = document.querySelectorAll('.desconto-calculadora');
        const camposPreco = document.querySelectorAll('.preco-com-desconto');
        const camposPrecoInicial = document.querySelectorAll('.preco-inicial');
        const camposUnidadesPorCaixa = document.querySelectorAll('.unidades-por-caixa');

        camposDesconto.forEach((campoDesconto, index) => {
            const campoPreco = camposPreco[index];
            const campoPrecoInicial = camposPrecoInicial[index];
            const campoUnidadesPorCaixa = camposUnidadesPorCaixa[index];

            // Evento para calcular e exibir o preço com desconto
            campoDesconto.addEventListener('input', () => {
                const precoInicial = parseFloat(campoPrecoInicial.value) || 0;
                const desconto = parseFloat(campoDesconto.value);
                const unidadesPorCaixa = parseFloat(campoUnidadesPorCaixa.value) || 1;
                const precoComDesconto = (precoInicial / unidadesPorCaixa * (1 - desconto / 100)).toFixed(3);
                campoPreco.value = precoComDesconto;
            });

            // Evento para calcular e exibir o desconto
            campoPreco.addEventListener('input', () => {
                const precoInicial = parseFloat(campoPrecoInicial.value) || 0;
                const precoComDesconto = parseFloat(campoPreco.value) || 0;
                const unidadesPorCaixa = parseFloat(campoUnidadesPorCaixa.value) || 1;
                const desconto = calcularDesconto(precoInicial, precoComDesconto, unidadesPorCaixa);
                campoDesconto.value = desconto;
            });

            // Evento para atualizar o preço final quando o preço inicial é modificado
            campoPrecoInicial.addEventListener('input', () => {
                const precoInicial = parseFloat(campoPrecoInicial.value) || 0;
                const desconto = parseFloat(campoDesconto.value);
                const unidadesPorCaixa = parseFloat(campoUnidadesPorCaixa.value) || 1;
                const precoComDesconto = (precoInicial / unidadesPorCaixa * (1 - desconto / 100)).toFixed(3);
                campoPreco.value = precoComDesconto;
            });

            // Evento para atualizar o preço final quando a quantidade de unidades por caixa é modificada
            campoUnidadesPorCaixa.addEventListener('input', () => {
                const precoInicial = parseFloat(campoPrecoInicial.value) || 0;
                const desconto = parseFloat(campoDesconto.value);
                const unidadesPorCaixa = parseFloat(campoUnidadesPorCaixa.value) || 1;
                const precoComDesconto = (precoInicial / unidadesPorCaixa * (1 - desconto / 100)).toFixed(3);
                campoPreco.value = precoComDesconto;
            });
        });
    }

    // Função para limpar todos os campos da calculadora
    function limparCampos() {
        const camposDesconto = document.querySelectorAll('.desconto-calculadora');
        const camposPreco = document.querySelectorAll('.preco-com-desconto');
        const camposPrecoInicial = document.querySelectorAll('.preco-inicial');
        const camposUnidadesPorCaixa = document.querySelectorAll('.unidades-por-caixa');

        camposDesconto.forEach(campoDesconto => campoDesconto.value = "");
        camposPreco.forEach(campoPreco => campoPreco.value = "");
        camposPrecoInicial.forEach(campoPrecoInicial => campoPrecoInicial.value = "");
        camposUnidadesPorCaixa.forEach(campoUnidadesPorCaixa => campoUnidadesPorCaixa.value = "1");
    }

    // Função para aguardar o carregamento completo da página
    function aguardarCarregamento() {
        criarCalculadora();
        adicionarEventos();
    }

    // Aguardar até que a página esteja completamente carregada
    aguardarCarregamento();
})();
