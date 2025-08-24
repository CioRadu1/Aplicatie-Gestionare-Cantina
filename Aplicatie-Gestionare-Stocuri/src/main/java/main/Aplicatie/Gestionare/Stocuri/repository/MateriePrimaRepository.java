package main.Aplicatie.Gestionare.Stocuri.repository;

import main.Aplicatie.Gestionare.Stocuri.model.MateriePrima;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MateriePrimaRepository extends JpaRepository<MateriePrima, String> {
    List<MateriePrima> findByDenumireContainingIgnoreCase(String denumire);
    List<MateriePrima> findByGestiune(String gestiune);
}
