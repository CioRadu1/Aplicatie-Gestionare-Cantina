package main.Aplicatie.Gestionare.Stocuri.repository;

import main.Aplicatie.Gestionare.Stocuri.model.ExecutieReteta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExecutieRetetaRepository extends JpaRepository<ExecutieReteta, String> {
    List<ExecutieReteta> findByNumeRetetaContainingIgnoreCase(String numeReteta);
}