/*
// Note 1: I have to add verification for email id (valid email and email is not repeated)
* */


package com.example.FitBuddy.Authentication;


import com.example.FitBuddy.Entity.Activities;
import com.example.FitBuddy.Entity.User;
import org.apache.juli.logging.Log;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Description;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.lang.reflect.Array;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

@RestController
@RequestMapping(path = "fitbuddy/auth")
public class AuthenticationController {
    @Autowired
    private AuthenticationService service;



    @PostMapping(path = "/register")
    public void registerNewUser(@RequestParam("photo") MultipartFile multipartFile, @RequestParam("firstName") String firstName, @RequestParam("lastName") String lastName, @RequestParam("email") String email, @RequestParam("password") String password, @RequestParam("about") String about, @RequestParam("activitiesSelected") String activities){
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



    }

    @PostMapping(path = "/login")
    public void login(@RequestParam("email") String email, @RequestParam("password") String password)
    {
        Argon2PasswordEncoder encoder = new Argon2PasswordEncoder(32,64,1,15*1024,2);
        var encodedPassword = encoder.encode(password);

        var dbPass = service.getUserCredential(encodedPassword);

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
        ArrayList<String> activityLs = new ArrayList<>();
        var activitiesArr = activities.toCharArray();
        String activity="";
        List<Activities> selectedActivityList = null;
        for (char activityNumVal: activitiesArr) {

            if(activityNumVal == ACTIVITIES.Basketball.getNumVal())
            {
                activity = "BasketBall";
            } else if (activityNumVal == ACTIVITIES.Running.getNumVal()) {
                activity = "Running";
            }
            else if (activityNumVal == ACTIVITIES.Football.getNumVal()) {
                activity = "Football";
            }
            else if (activityNumVal == ACTIVITIES.Cycling.getNumVal()) {
                activity = "Cycling";
            }
            else if (activityNumVal == ACTIVITIES.IceHockey.getNumVal()) {
                activity = "Ice Hockey";
            }
            activityLs.add(activity);

        }
        return activityLs;

    }

    enum ACTIVITIES{

        Basketball('1'),
        Football('2'),
        Cycling('3'),
        IceHockey('4'),
        Running('5');


        private char numVal;

        ACTIVITIES(char numVal) {
            this.numVal = numVal;
        }

        public char getNumVal() {
            return numVal;
        }
    }
}
