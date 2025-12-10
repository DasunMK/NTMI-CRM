package lk.ntmi.ticketing_system.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;
import java.util.ArrayList;

@Data
@Document(collection = "settings")
public class AppSettings {
    @Id
    private String id; // Fixed ID: "CONFIG_001"
    
    private List<String> branches = new ArrayList<>();
    private List<String> errorCategories = new ArrayList<>();
    private List<ErrorType> errorTypes = new ArrayList<>();

    // Nested Class for Error Type (Links Name + Category)
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ErrorType {
        private String name;     // e.g., "Printer Jam"
        private String category; // e.g., "Hardware"
    }
}