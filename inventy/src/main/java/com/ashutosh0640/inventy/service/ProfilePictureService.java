package com.ashutosh0640.inventy.service;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Service
public class ProfilePictureService {

    @Value("${upload.path}")
    private static String uploadDir;

    @Value("${server.base-url}")
    private static String baseUrl;

    public static String getprofileUrl(MultipartFile profilePicture) throws IOException {
        String contentType = profilePicture.getContentType();
        if (!Objects.requireNonNull(contentType).equalsIgnoreCase("image/jpeg") && !contentType.equals("image/jpeg")) {
            throw new IllegalArgumentException("Profile picture should be png or jpeg.");
        }
        String fileName = UUID.randomUUID().toString() +"_"+ profilePicture.getOriginalFilename();
        Path path = Paths.get(uploadDir, fileName);
        Files.copy(profilePicture.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
        return baseUrl + "/uploads/" + fileName;
    }
}
