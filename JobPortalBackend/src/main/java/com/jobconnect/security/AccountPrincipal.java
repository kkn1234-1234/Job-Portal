package com.jobconnect.security;

import com.jobconnect.entity.AccountRole;
import java.util.Collection;
import java.util.Collections;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class AccountPrincipal implements UserDetails {

    private final Long id;
    private final String email;
    private final String password;
    private final AccountRole role;

    public AccountPrincipal(Long id, String email, String password, AccountRole role) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public static AccountPrincipal applicant(Long id, String email, String password) {
        return new AccountPrincipal(id, email, password, AccountRole.APPLICANT);
    }

    public static AccountPrincipal employer(Long id, String email, String password) {
        return new AccountPrincipal(id, email, password, AccountRole.EMPLOYER);
    }

    public Long getId() {
        return id;
    }

    public AccountRole getRole() {
        return role;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
