from gpiozero import LED, Button
import time

# Pin setup using GPIO Zero
pulse_pin = LED(16)             # Pulse pin controlled as an LED
direction_pin = LED(20)         # Direction pin
enable_pin = LED(21)            # Enable pin

# Limit switches as buttons
lmmax_pin = Button(6)  # Max limit switch
lmmin_pin = Button(12) # Min limit switch

# Function to control the stepper motor movement using blink
def stepper_blink_movement(direction, steps_per_second, stop_condition, duration=None):
    enable_pin.on()  # Enable the motor
    direction_pin.value = direction  # Set direction

    pulse_time = 1 / (2 * steps_per_second)
    pulse_pin.blink(on_time=pulse_time, off_time=pulse_time, n=None, background=True)

    start_time = time.time()
    while not stop_condition.is_pressed:
        if duration and (time.time() - start_time > duration):
            break
        time.sleep(0.1)  # Small sleep to reduce CPU usage

    pulse_pin.off()  # Ensure the pulse pin is off
    enable_pin.off()  # Disable the motor

# Example usage
# Move stepper motor with parameters: direction, speed, stop condition
stepper_blink_movement(True, 3200, lmmin_pin, duration=10)  # Runs for 10 seconds or until the limit switch is triggered
