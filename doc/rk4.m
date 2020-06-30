function x = rk4(xdot, x_initial, t0, tf, dt)
%RK4 Fourth order Runge-Kutta 
%   x_dot:      Statespace function derivative
%   x_initial:  Initial row vector state
%   t0:         Initial time
%   tf:         Final time
%   dt:         Time step
arguments
   xdot (1, 1) function_handle
   x_initial (1,:) double
   t0 (1, 1) double = 0
   tf (1, 1) double = 5
   dt (1, 1) double = .1
end
nt = length(t0:dt:tf);              % Number of time steps
x = zeros(nt, length(x_initial));   % State vector record
x(1,:) = x_initial;

for i = 2:nt
    k1 = xdot(x(i-1,:))*dt;
    k2 = xdot(x(i-1,:)+.5*k1)*dt;
    k3 = xdot(x(i-1,:)+.5*k2)*dt;
    k4 = xdot(x(i-1,:)+k3)*dt;
    
    x(i,:) = x(i-1,:) + k1/6 + k2/3 + k3/3 + k4/6;
end
end

