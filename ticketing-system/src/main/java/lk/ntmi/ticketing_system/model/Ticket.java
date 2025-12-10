package lk.ntmi.ticketing_system.model;


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "tickets")
public class Ticket {
    @Id
    private String id; // Simple unique ID (e.g., T-1001)
    
    private String branchId; // Who raised it
    private String branchName;
    
    private String errorCategory; // Dropdown value
    private String errorType;     // Dropdown value
    private String description;   // Optional text box
    
    private String status; // "PENDING", "IN_PROGRESS", "COMPLETED"
    
    private LocalDateTime createdDate;
    private LocalDateTime resolvedDate;

    private String fixedBy;       // The Admin who clicked "Start"
    private LocalDateTime startTime; // When they clicked "Start"
    private LocalDateTime endTime;   // When they clicked "Complete"
    
    // To track history/chat between Branch and Ops
    private List<TicketLog> logs; 
}