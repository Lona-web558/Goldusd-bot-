//goldusd bot system

// script.js

let botActive = false;
let currentPrice = 2045.50;
let totalTrades = 0;
let winningTrades = 0;
let totalProfit = 0;
let priceInterval;
let tradeInterval;
let priceHistory = [];
let timeLabels = [];
let chart;

//Initialize chart
function initChart() {
	const ctx = document.getElementById('priceChart').getContext('2d');
	chart = new Chart(ctx, {
		type: 'line', 
		data: {
			labels: timeLabels, 
			datasets: [{
				label: 'GOLD PRICE, USD', 
				data: priceHistory, 
				borderColor: '#ffd700', 
				backgroundColor: 
				'rgba(255,215, 0,0.1)', 
				borderWidth: 3,
				tension: 0.4,
				fill: true, 
				pointRadius: 2,
				pointHoverRadius: 5,
				pointBackgroundColor: '#ffd700', 
				pointBorderColor: '#fff', 
				pointBorderWidth: 2
				
			}	]
		}, 
		options: {
			responsive: true, 
			maintainAspectRatio: true, 
			aspectRatio: 2.5,
			plugins: {
				legend: {
					display: true, 
					position: 'top'
				}, 
				tooltip: {
					mode: 'index', 
					intersect: false, 
					callbacks: {
						label: 	function(context) {
							return 'Price: $' + context.parsed.y.toFixed(2);
						}
						
					}
				}
			}, 
			scales: {
				x: {
					display: true, 
					title: {
						display: true, 
						text: 'Time'
					}, 
					ticks: {
						maxTicksLimit: 10
					}
				}, 
				y: {
					display: true, 
					title: {
						display: true, 
						text: 'Price (USD)'
					}, 
					ticks: {
						callback: function (value) {
							return '$' + value.toFixed(0);
						}
					}
				}
			}, 
			interaction: {
				mode: 'nearest', 
				axis: 'x', 
				intersect: false
			}
		}
	});
}


//function updatechart
function updateChart() {
	const now = new Date();
	const timeString = now.toLocaleTimeString();
	
	priceHistory.push(currentPrice);
	timeLabels.push(timeString);
	
	//keep only last 30 data points 
	
	if (priceHistory.length > 30){
		priceHistory.shift();
		timeLabels.shift();
	}
	
	chart.update('none'); //update without animation for smooth real-time feel
	
}


//function update price

function updatePrice(){
	const change = (Math.random()- 0.5) *5;
	currentPrice += change;
	currentPrice = Math.max(2000, Math.min(2100, currentPrice));
	document.getElementById('currentPrice').textContent = currentPrice.toFixed(2);
	updateChart();
}


//function execute trade

function executeTrade() {
	if (!botActive) return;
	
	const isWin = Math.random() > 0.35;
	const profitAmount = isWin  ? (Math.random() * 50 + 30).toFixed(2):
	- (Math.random() * 40 + 20).toFixed(2);
	
	
	totalTrades++;
	if (isWin) winningTrades++;
	totalProfit += parseFloat(profitAmount);
	
	updateStats();
	addTradeToLog(isWin, profitAmount, currentPrice);
}



//function update stats

function updateStats() {
	const winRate = totalTrades > 0 ? ((winningTrades / totalTrades) * 100).toFixed(1):0;
	document.getElementById('winRate').textContent = winRate;
	 document.getElementById('totalTrades').textContent = totalTrades;
	 
	 document.getElementById('totalProfit').textContent = totalProfit.toFixed(2);
}

//function addTradeToLog

function addTradeToLog(isWin, profit, price) {
	const tradeLog = document.getElementById('tradeLog');
	
	if (totalTrades === 1){
		tradeLog.innerHTML = '<h6 class="mb-3" >Trade History</h6>';
	}
	
	const tradeEntry = document.createElement('div');
	tradeEntry.className = `trade-entry ${isWin? 'trade-win':'trade-loss'}`;
	
	const time = new Date().toLocaleTimeString();
	const action = isWin ? 'WIN': 'LOSS';
	const symbol = parseFloat(profit) >= 0 ? '+' : '';
	
	tradeEntry.innerHTML = `<div class="d-flex justify-content-between align-items-center">
	<div>
	<strong>${action}</strong>
	Trade #${totalTrades} <br><small>Price: $${price.toFixed(2)} | ${time}</small>
	</div>
	<div>
	<strong class="${isWin ? 'text-success':'text-danger'}">
	${symbol}$${profit}
	</strong>
	</div>
	</div>
	`;
	
	tradeLog.insertBefore(tradeEntry, tradeLog.children[1]);
	
	if (tradeLog.children.length > 11){
		tradeLog.removeChild(tradeLog.lastChild);
	}
	
}

//function togglebot

function toggleBot() {
	botActive = !botActive;
	const btn = document.getElementById('startBtn');
	const statusIndicator = document.getElementById('statusIndicator');
	const statusText = document.getElementById('statusText');
	
	if (botActive) {
		btn.textContent = 'STOP BOT';
		btn.className = 'btn btn-stop';
		statusIndicator.className = 'status-Indicator status-active';
		statusText.textContent = 'Bot Active - Trading';
		
		
		priceInterval = setInterval(updatePrice, 1000);
		tradeInterval = setInterval(executeTrade, 3000);
		}else{
			btn.textContent = 'START BOT';
			btn.className = 'btn btn-start';
			statusIndicator.className = 'status-indicator status-inactive';
			statusText.textContent = 'BOT Inactive';
			
			clearInterval(priceInterval);
			clearInterval(tradeInterval);
		
	}
}

setInterval(updatePrice, 2000);

//Initialize chart when page loads

window.addEventListener ('load', 
	function() {
		initChart();
		//Add initial data point
		updateChart();
	});