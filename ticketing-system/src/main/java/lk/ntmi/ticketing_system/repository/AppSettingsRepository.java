package lk.ntmi.ticketing_system.repository;

import lk.ntmi.ticketing_system.model.AppSettings;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AppSettingsRepository extends MongoRepository<AppSettings, String> {
}