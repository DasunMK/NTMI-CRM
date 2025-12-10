package lk.ntmi.ticketing_system.model;

import lombok.Data;
import lombok.NoArgsConstructor; // Important for MongoDB
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor // <--- This prevents the 500 Error
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String username;   // Matches "username"
    private String password;   // Matches "password"
    private String role;       // Matches "role"
    private String branchName; // Matches "branchName" (camelCase)
    // ...
}