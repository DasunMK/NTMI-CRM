package lk.ntmi.ticketing_system.model;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TicketLog {
    private String message;
    private String updatedBy;
    private LocalDateTime timestamp;
}