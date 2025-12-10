package lk.ntmi.ticketing_system.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;
    
    // Core Auth
    private String username;
    private String password;
    private String role;       // "OPS" or "BRANCH"
    private String branchName; 
    
    // NEW: Personal Details
    private String fullName;
    private String email;
    private String phone;
    
    private Boolean active = true;
}