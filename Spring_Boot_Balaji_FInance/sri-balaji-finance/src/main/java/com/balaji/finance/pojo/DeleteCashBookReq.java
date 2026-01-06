package com.balaji.finance.pojo;

import java.util.List;

public class DeleteCashBookReq {

	private List<Double> transactionId;
	private String comments;

	public List<Double> getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(List<Double> transactionId) {
		this.transactionId = transactionId;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

}
