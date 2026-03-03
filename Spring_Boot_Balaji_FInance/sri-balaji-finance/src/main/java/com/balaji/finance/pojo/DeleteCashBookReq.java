package com.balaji.finance.pojo;

import java.util.List;

public class DeleteCashBookReq {

	private List<Long> transactionId;
	private String comments;

	public List<Long> getTransactionId() {
		return transactionId;
	}

	public void setTransactionId(List<Long> transactionId) {
		this.transactionId = transactionId;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

}
