/*
// Note 1: I have to add verification for email id (valid email and email is not repeated)
* */


package com.example.FitBuddy.Authentication;


import com.example.FitBuddy.Entity.Activities;
import com.example.FitBuddy.Entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;


@RestController
@RequestMapping(path = "fitbuddy/auth")
public class AuthenticationController {
    @Autowired
    private AuthenticationService service;



    @PostMapping(path = "/register")
    public void registerNewUser(@RequestParam("photo") MultipartFile multipartFile, @RequestParam("firstName") String firstName, @RequestParam("lastName") String lastName, @RequestParam("email") String email, @RequestParam("password") String password, @RequestParam("about") String about, @RequestParam("activitiesSelected") String activities) throws IOException {
        String passwordHash = passwordHashing(password);

        String photoFileName = StringUtils.cleanPath(multipartFile.getOriginalFilename());

        ArrayList<Activities> selectedActivityList = new ArrayList<>();



        List<String> activityLs = setActivities(activities);

        for (String str: activityLs) {
            Activities tempObj = new Activities();
            tempObj = service.getActivityList(str);
            selectedActivityList.add(tempObj);
        }


        User newUser = new User();
        newUser.setFirstName(firstName);
        newUser.setLastName(lastName);
        newUser.setBio(about);
        newUser.setPassword(passwordHash);
        newUser.setActivities(selectedActivityList);
        newUser.setPhoto(photoFileName);
        newUser.setEmail(email);

        service.addNewUser(newUser);

        //region Image Saving in Directory
        String uploadDir = "src/main/resources/static/" + email;
        saveImageFile(uploadDir, photoFileName, multipartFile);
        //endregion



    }
    @PostMapping(path = "/login")
    public void login(@RequestParam("email") String email, @RequestParam("password") String password)
    {
        Argon2PasswordEncoder encoder = new Argon2PasswordEncoder(32,64,1,15*1024,2);
        var encodedPassword = encoder.encode(password);

        var dbPass = service.getUserCredential(encodedPassword);
        var pass = service.getTest(encodedPassword);

        if(dbPass)
        {
            System.out.println("Login Success");
        }
        else{
            throw new RuntimeException("Wrong Password or email");
        }


    }
    private String passwordHashing(String password)
    {
        Argon2PasswordEncoder encoder = new Argon2PasswordEncoder(32,64,1,15*1024,2);

        String encodedPassword = encoder.encode(password);

        return encodedPassword;
    }

    private ArrayList<String> setActivities(String activities)
    {
        String[] activitiesArr = activities.split(",");
        ArrayList<String> activityLs = new ArrayList<>();
        String activity="";
        List<Activities> selectedActivityList = null;
        for (String activityNumVal: activitiesArr) {

            if(activityNumVal.equals(ACTIVITIES.Basketball.getNumVal()) )
            {
                activity = "Basketball";
            } else if (activityNumVal.equals(ACTIVITIES.Running.getNumVal())) {
                activity = "Running";
            }
            else if (activityNumVal.equals(ACTIVITIES.Football.getNumVal())) {
                activity = "Football";
            }
            else if (activityNumVal.equals(ACTIVITIES.Cycling.getNumVal())) {
                activity = "Cycling";
            }
            else if (activityNumVal.equals(ACTIVITIES.IceHockey.getNumVal())) {
                activity = "Ice Hockey";
            }
            activityLs.add(activity);
        var test = ACTIVITIES.Basketball;
        }
        return activityLs;

    }


        public static void saveImageFile(String uploadDir, String fileName,
                                    MultipartFile multipartFile) throws IOException {
            Path uploadPath = Paths.get(uploadDir);

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            try (InputStream inputStream = multipartFile.getInputStream()) {
                Path filePath = uploadPath.resolve(fileName);
                Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
            } catch (IOException ioe) {
                throw new IOException("Could not save image file: " + fileName, ioe);
            }
        }

    enum ACTIVITIES{

        Basketball("1"),
        Football("2"),
        Cycling("3"),
        IceHockey("4"),
        Running("5");


        private String numVal;

        ACTIVITIES(String numVal) {
            this.numVal = numVal;
        }

        public String getNumVal() {
            return numVal;
        }
    }
}
