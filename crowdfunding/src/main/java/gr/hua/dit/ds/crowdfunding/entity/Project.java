package gr.hua.dit.ds.crowdfunding.entity;

import jakarta.persistence.*;

@Entity
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column
    private Integer Id;

    @Column
    private String name;

    @Column
    private String description;

    @Column
    private String Creator;

    @Column
    private Boolean approved;

    @Column
    private Integer fundingGoal;

    @Column
    private Integer currentFunding;

    public Project(String name, String description, Boolean approved, Integer fundingGoal, Integer currentFunding, String Creator) {
        this.name = name;
        this.description = description;
        this.approved = approved;
        this.fundingGoal = fundingGoal;
        this.currentFunding = currentFunding;
        this.Creator = Creator;
    }

    public Project() {
    }
    public Integer getId() {
        return Id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Boolean getApproved() {
        return approved;
    }

    public Integer getFundingGoal() {
        return fundingGoal;
    }

    public Integer getCurrentFunding() {
        return currentFunding;
    }

    public void setId(Integer id) {
        this.Id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setApproved(Boolean approved) {
        this.approved = approved;
    }

    public void setFundingGoal(Integer fundingGoal) {
        this.fundingGoal = fundingGoal;
    }

    public void setCurrentFunding(Integer currentFunding) {
        this.currentFunding = currentFunding;
    }

    public String getCreator() {
        return Creator;
    }

    public void setCreator(String creator) {
        Creator = creator;
    }

    @Override
    public String toString() {
        return "Project{" +
                "Id=" + Id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", Creator='" + Creator + '\'' +
                ", approved=" + approved +
                ", fundingGoal=" + fundingGoal +
                ", currentFunding=" + currentFunding +
                '}';
    }
}