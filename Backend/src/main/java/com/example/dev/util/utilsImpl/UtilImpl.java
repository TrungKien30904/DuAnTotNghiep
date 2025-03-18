package com.example.dev.util.utilsImpl;

import com.example.dev.util.IUtil;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
@Service
public class UtilImpl implements IUtil {

    private static final String LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
    private static final String UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String DIGITS = "0123456789";
    private static final String SPECIAL_CHARACTERS = "!@#$%^&*()-_=+[]{}|;:'\",.<>?/";

    private static final int MIN_PASSWORD_LENGTH = 8;

    @Override
    public String generatePassword() {
        try{
            SecureRandom random = new SecureRandom();

            StringBuilder password = new StringBuilder();

            // Ensure at least one lowercase character
            password.append(LOWERCASE.charAt(random.nextInt(LOWERCASE.length())));

            // Ensure at least one uppercase character
            password.append(UPPERCASE.charAt(random.nextInt(UPPERCASE.length())));

            // Ensure at least one digit
            password.append(DIGITS.charAt(random.nextInt(DIGITS.length())));

            // Ensure at least one special character
//            password.append(SPECIAL_CHARACTERS.charAt(random.nextInt(SPECIAL_CHARACTERS.length())));

            // Fill the rest of the password with a mix of characters
            String allCharacters = LOWERCASE + UPPERCASE + DIGITS + SPECIAL_CHARACTERS;
            for (int i = password.length(); i < MIN_PASSWORD_LENGTH; i++) {
                password.append(allCharacters.charAt(random.nextInt(allCharacters.length())));
            }
            // Shuffle the password to ensure randomness
            return shufflePassword(password.toString());
        }
        catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }


    private static String shufflePassword(String password) {
        SecureRandom random = new SecureRandom();
        StringBuilder shuffledPassword = new StringBuilder(password);

        for (int i = 0; i < shuffledPassword.length(); i++) {
            int randomIndex = random.nextInt(shuffledPassword.length());
            char temp = shuffledPassword.charAt(i);
            shuffledPassword.setCharAt(i, shuffledPassword.charAt(randomIndex));
            shuffledPassword.setCharAt(randomIndex, temp);
        }

        return shuffledPassword.toString();
    }
}
