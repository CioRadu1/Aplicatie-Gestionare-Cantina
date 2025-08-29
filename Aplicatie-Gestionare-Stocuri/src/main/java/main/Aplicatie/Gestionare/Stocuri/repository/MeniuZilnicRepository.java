package main.Aplicatie.Gestionare.Stocuri.repository;

import jakarta.transaction.Transactional;
import main.Aplicatie.Gestionare.Stocuri.model.MeniuZilnic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MeniuZilnicRepository extends JpaRepository<MeniuZilnic, String> {
    List<MeniuZilnic> findByNumeRetetaContainingIgnoreCase(String numeReteta);
    Optional<MeniuZilnic> findById(String codArticol);
    @Modifying
    @Transactional
    @Query( value = "BEGIN TRY " +
            "  EXEC sp_set_session_context @key=N'finalizare_zi', @value=1; " +
            "  DELETE FROM meniu_zilnic; " +
            "END TRY " +
            "BEGIN CATCH " +
            "  EXEC sp_set_session_context @key=N'finalizare_zi', @value=0; " +
            "  THROW; " +
            "END CATCH; " +
            "EXEC sp_set_session_context @key=N'finalizare_zi', @value=0;",
            nativeQuery = true
    )
    void finalizeDay();
}