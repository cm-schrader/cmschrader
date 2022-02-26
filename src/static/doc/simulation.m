%% Christian M. Schrader

%% Initialization
clc; clf; clear; close; 

% Initial Variables
dt = .01;
t0 = 0;
tf = 5;
time = t0:dt:tf;
init_state = [0
              0
              0
              deg2rad(.1)
              ]';

x = rk4(@state, init_state, t0, tf, dt);

% Energy Equation
M = 10;   % Cart mass       (kg)
m = 1;    % Pendulum mass   (kg)
l = 1;    % Pendulum length (m)
g = 9.81; % Gravitational Acceleration (m/s^2)
Energy = @(xe) (0.5*M*xe(2)^2) + (m*g*l*cos(xe(3))) + (0.5*m*((xe(2)+xe(4)*l*cos(xe(3)))^2+(xe(4)*l*sin(xe(3)))^2)) + ((2/3)*m*l^2*xe(4)^2);
E = zeros(1, length(x));
for ii = 1:length(E)
    E(ii) = Energy(x(ii,:));
end

%% Graph
subplot(5, 1, 1);
hold on;
plot(time, x(:,1), "b");
xlabel("Time (s)"); ylabel("P (m)");
subplot(5, 1, 2);
hold on;
plot(time, x(:,2), "b");
xlabel("Time (s)"); ylabel("V (m\s)");
subplot(5, 1, 3);
hold on;
plot(time, x(:,3), "b");
xlabel("Time (s)"); ylabel("\Theta (rad)");
subplot(5, 1, 4);
hold on;
plot(time, x(:,4), "b");
xlabel("Time (s)"); ylabel("\omega (rad/s)");
subplot(5, 1, 5);
hold on;
plot(time, E, "b");
xlabel("Time (s)"); ylabel("E (J)");

function xdot = state(x)
    u = 0;

    % Constants
    M = 10;   % Cart mass       (kg)
    m = 1;    % Pendulum mass   (kg)
    l = 1;    % Pendulum length (m)
    g = 9.81; % Gravitational Acceleration (m/s^2)
    
    % Model
    delta = 7/3*(M+m)*m*l^2-(m*l*cos(x(3)))^2;
    xdot = [x(2)
            (7/3*m*l^2*(u+m*l*x(4)^2*sin(x(3)))-m^2*g*l^2*cos(x(3))*sin(x(3)))/delta
            x(4)
            ((M+m)*m*g*l*sin(x(3))-m*l*cos(x(3))*(u+m*l*x(4)^2*sin(x(3))))/delta
            ]';
end