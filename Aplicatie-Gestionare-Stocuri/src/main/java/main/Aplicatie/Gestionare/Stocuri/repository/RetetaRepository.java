package main.Aplicatie.Gestionare.Stocuri.repository;

import main.Aplicatie.Gestionare.Stocuri.model.Reteta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RetetaRepository extends JpaRepository<Reteta, String> {
    List<Reteta> findByDenumireContainingIgnoreCase(String numeReteta);
    @Query("SELECT DISTINCT r.denumireUm FROM Reteta r")
    List<String> findDistinctDenumireUm();
}