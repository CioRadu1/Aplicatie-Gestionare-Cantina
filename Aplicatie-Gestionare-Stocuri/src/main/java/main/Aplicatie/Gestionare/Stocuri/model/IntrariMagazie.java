package main.Aplicatie.Gestionare.Stocuri.model;

import jakarta.persistence.Column;
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
    @Column(name = "nume_ingredient")
    private String numeIngredient;
    private BigDecimal cantitate;
    @Column(name = "cantitate_folosita")
    private BigDecimal cantitateFolosita;
    @Column(name = "pret_achizitie")
    private BigDecimal pretAchizitie;
    @Column(name = "pret_total_cantitate_cumparata", insertable = false,updatable = false)
    private BigDecimal pretTotalCantitateCumparata;
    @Column(name = "pret_total_cantitate_utilizata", insertable = false, updatable = false)
    private BigDecimal pretTotalCantitateUtilizata;
}