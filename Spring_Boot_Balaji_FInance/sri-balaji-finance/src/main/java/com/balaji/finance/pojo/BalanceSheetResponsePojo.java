package com.balaji.finance.pojo;

import java.math.BigDecimal;
import java.util.List;

import com.balaji.finance.dto.BalanceSheetProjection;

public class BalanceSheetResponsePojo {

	private List<BalanceSheetProjection> balanceSheetProjections;
	private BigDecimal totalShares;

	public List<BalanceSheetProjection> getBalanceSheetProjections() {
		return balanceSheetProjections;
	}

	public void setBalanceSheetProjections(List<BalanceSheetProjection> balanceSheetProjections) {
		this.balanceSheetProjections = balanceSheetProjections;
	}

	public BigDecimal getTotalShares() {
		return totalShares;
	}

	public void setTotalShares(BigDecimal totalShares) {
		this.totalShares = totalShares;
	}

}
