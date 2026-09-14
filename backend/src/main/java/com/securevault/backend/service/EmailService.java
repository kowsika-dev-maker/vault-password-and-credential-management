package com.securevault.backend.service;

import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final Resend resend;

    public EmailService() {

        String apiKey = System.getenv("RESEND_API_KEY");

        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "RESEND_API_KEY environment variable is not set"
            );
        }

        this.resend = new Resend(apiKey);
    }

    public void sendEmail(String to, String subject, String message) {

        try {

            System.out.println("EMAIL SERVICE STARTED");
            System.out.println("EMAIL TO: " + to);
            System.out.println("EMAIL SUBJECT: " + subject);

            CreateEmailOptions params = CreateEmailOptions.builder()
                    .from("onboarding@resend.dev")
                    .to(to)
                    .subject(subject)
                    .text(message)
                    .text(message)
                    .build();

            resend.emails().send(params);

            System.out.println("EMAIL SENT SUCCESSFULLY TO: " + to);

        } catch (ResendException e) {

            System.err.println("========== RESEND EMAIL ERROR ==========");
            System.err.println("EMAIL TO: " + to);
            System.err.println("ERROR MESSAGE: " + e.getMessage());
            System.err.println("ERROR TYPE: " + e.getClass().getName());
            System.err.println("========================================");

            e.printStackTrace();
        }
    }
}
