package com.example.FitBuddy.Repositories;

import com.example.FitBuddy.Entity.Registration;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

public interface AuthenticationRepository extends MongoRepository<Registration, String > {

}
