package main.Aplicatie.Gestionare.Stocuri.model;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "intrari_magazie")
@Data
public class IntrariMagazie {
    @EmbeddedId
    private IntrariMagazieKey id;
    private String numeIngredient;
    private BigDecimal cantitate;
    private BigDecimal cantitateFolosita;
    private BigDecimal pretAchizitie;
    private BigDecimal pretTotalCantitateCumparata;
    private BigDecimal pretTotalCantitateUtilizata;
}