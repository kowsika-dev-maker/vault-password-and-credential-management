package com.securevault.backend.dto;

public class LoginActivityReport {

    private long totalAttempts;

    private long successfulLogins;

    private long failedLogins;


    public LoginActivityReport() {
    }


    public LoginActivityReport(
            long totalAttempts,
            long successfulLogins,
            long failedLogins) {

        this.totalAttempts = totalAttempts;
        this.successfulLogins = successfulLogins;
        this.failedLogins = failedLogins;
    }


    public long getTotalAttempts() {
        return totalAttempts;
    }

    public void setTotalAttempts(long totalAttempts) {
        this.totalAttempts = totalAttempts;
    }


    public long getSuccessfulLogins() {
        return successfulLogins;
    }

    public void setSuccessfulLogins(long successfulLogins) {
        this.successfulLogins = successfulLogins;
    }


    public long getFailedLogins() {
        return failedLogins;
    }

    public void setFailedLogins(long failedLogins) {
        this.failedLogins = failedLogins;
    }
}