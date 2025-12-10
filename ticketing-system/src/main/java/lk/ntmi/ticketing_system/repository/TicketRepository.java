package lk.ntmi.ticketing_system.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import lk.ntmi.ticketing_system.model.Ticket;

public interface TicketRepository extends MongoRepository<Ticket, String> {
    // Custom query to find tickets by branch
    List<Ticket> findByBranchName(String branchName);
    
    // Custom query to find tickets by status (for Dashboard)
    List<Ticket> findByStatus(String status);
}