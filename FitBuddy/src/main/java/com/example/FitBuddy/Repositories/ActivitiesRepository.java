package com.example.FitBuddy.Repositories;

import com.example.FitBuddy.Entity.Activities;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ActivitiesRepository extends MongoRepository<Activities, String> {
    Activities findByName(String name);

}
