package com.securevault.backend.dto;

public class PasswordHealthReport {

    private long totalCredentials;

    private long strongPasswords;

    private long mediumPasswords;

    private long weakPasswords;

    private int healthScore;

    private String summary;


    public PasswordHealthReport() {
    }


    public PasswordHealthReport(
            long totalCredentials,
            long strongPasswords,
            long mediumPasswords,
            long weakPasswords,
            int healthScore,
            String summary) {

        this.totalCredentials = totalCredentials;
        this.strongPasswords = strongPasswords;
        this.mediumPasswords = mediumPasswords;
        this.weakPasswords = weakPasswords;
        this.healthScore = healthScore;
        this.summary = summary;
    }


    public long getTotalCredentials() {
        return totalCredentials;
    }

    public void setTotalCredentials(long totalCredentials) {
        this.totalCredentials = totalCredentials;
    }


    public long getStrongPasswords() {
        return strongPasswords;
    }

    public void setStrongPasswords(long strongPasswords) {
        this.strongPasswords = strongPasswords;
    }


    public long getMediumPasswords() {
        return mediumPasswords;
    }

    public void setMediumPasswords(long mediumPasswords) {
        this.mediumPasswords = mediumPasswords;
    }


    public long getWeakPasswords() {
        return weakPasswords;
    }

    public void setWeakPasswords(long weakPasswords) {
        this.weakPasswords = weakPasswords;
    }


    public int getHealthScore() {
        return healthScore;
    }

    public void setHealthScore(int healthScore) {
        this.healthScore = healthScore;
    }


    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }
}