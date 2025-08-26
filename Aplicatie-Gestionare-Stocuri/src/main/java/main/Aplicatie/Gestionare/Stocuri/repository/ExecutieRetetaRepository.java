package main.Aplicatie.Gestionare.Stocuri.repository;

import main.Aplicatie.Gestionare.Stocuri.model.ExecutieReteta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExecutieRetetaRepository extends JpaRepository<ExecutieReteta, String> {
    List<ExecutieReteta> findByNumeRetetaContainingIgnoreCase(String numeReteta);
    @Query("SELECT DISTINCT e.um FROM ExecutieReteta e")
    List<String> findDistinctUm();
    @Query("SELECT e.statusReteta FROM ExecutieReteta e WHERE e.codArticol = :codArticol")
    int findStatusByCodArticol(@Param("codArticol") String codArticol);
}