package main.Aplicatie.Gestionare.Stocuri.repository;

import main.Aplicatie.Gestionare.Stocuri.model.RetetaIngrediente;
import main.Aplicatie.Gestionare.Stocuri.model.RetetaIngredienteKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RetetaIngredienteRepository extends JpaRepository<RetetaIngrediente, RetetaIngredienteKey> {
    List<RetetaIngrediente> findByIdCodReteta(String codReteta);
}