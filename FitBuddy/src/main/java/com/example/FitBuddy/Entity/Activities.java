package com.example.FitBuddy.Entity;

public class Activities {
    private String name;
    private String image;

    public Activities(String name) {
        this.name = name;
    }


    public Activities(String name, String image) {
        this.name = name;
        this.image = image;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }
}
