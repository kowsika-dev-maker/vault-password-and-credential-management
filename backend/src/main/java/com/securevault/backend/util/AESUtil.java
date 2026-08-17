package com.securevault.backend.util;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class AESUtil {

    private static final String SECRET_KEY =
            "1234567890123456";

    private static final String ALGORITHM =
            "AES/ECB/PKCS5Padding";

    private static final SecretKeySpec KEY =
            new SecretKeySpec(
                    SECRET_KEY.getBytes(StandardCharsets.UTF_8),
                    "AES"
            );

    public static String encrypt(String password) {

        try {

            Cipher cipher = Cipher.getInstance(ALGORITHM);

            cipher.init(
                    Cipher.ENCRYPT_MODE,
                    KEY
            );

            byte[] encrypted =
                    cipher.doFinal(
                            password.getBytes(StandardCharsets.UTF_8)
                    );

            return Base64.getEncoder()
                    .encodeToString(encrypted);

        } catch (Exception e) {

            throw new RuntimeException(
                    "Password encryption failed",
                    e
            );
        }
    }

    public static String decrypt(String encryptedPassword) {

        try {

            Cipher cipher = Cipher.getInstance(ALGORITHM);

            cipher.init(
                    Cipher.DECRYPT_MODE,
                    KEY
            );

            byte[] decoded =
                    Base64.getDecoder()
                            .decode(encryptedPassword);

            byte[] decrypted =
                    cipher.doFinal(decoded);

            return new String(
                    decrypted,
                    StandardCharsets.UTF_8
            );

        } catch (Exception e) {

            throw new RuntimeException(
                    "Password decryption failed",
                    e
            );
        }
    }
}