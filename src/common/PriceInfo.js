PriceInfo.prototype = {
	reset: function () {
		this.priceType = 0
		this.ticketCount = 0
		this.price = 0
		this.parValue = 0
		this.tax = 0
		this.insurance = 0
		this.serviceCharge = 0
		this.commRate = 0
		this.commission = 0
		this.discountRate = 0
		this.discount = 0
		this.amount = 0
		this.totalAmount = 0
		this.cost = 0
		this.totalCost = 0
		this.profit = 0
		this.totalProfit = 0
	}
}

function PriceInfo() {
	this.reset()
};

// module.exports = dateFunc;
export default PriceInfo
