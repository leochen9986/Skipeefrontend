import phonenumbers

# Parse the phone number
phone_number = phonenumbers.parse("+15555555555", "US")

# Check if the phone number is valid
if phonenumbers.is_valid_number(phone_number):
  print("The phone number is valid.")
else:
  print("The phone number is not valid.")

# Get the country code
country_code = phone_number.country_code

# Get the national significant number
national_significant_number = phone_number.national_number

# Get the carrier information
carrier = phonenumbers.parse("15555555555", "US").carrier

# Get the geographical location
location = phonenumbers.parse("15555555555", "US").geo_description

# Print the results
print("Country code:", country_code)
print("National significant number:", national_significant_number)
print("Carrier:", carrier)
print("Geographical location:", location)