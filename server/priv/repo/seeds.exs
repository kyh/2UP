# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Database.Repo.insert!(%Database.SomeSchema{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias Database.Repo
alias Database.Catalog.Question
alias Database.Catalog.Answer

questions = [
  ["Who won the NBA finals in 2003?", "San Antonio Spurs"],
  ["Who was the 6th president of United States?", "John Quincy Adams"],
  ["On a QWERTY keyboard, what two letters have raised marks to assist with touch typing?", "F and J"],
  ["How do you call a group of unicorns?", "A blessing"],
  ["Who is the oldest man to win People Magazine's sexiest man alive?", "Sean Connery"],
  ["What kind of disaster is a volcano?", "Geological"],
  ["Since 1978, “Yankee Doodle” has been the official has been the official song of what U.S. state?", "Connecticut"],
  ["Which of the music on the epic 1982 album “Thriller” was recorded by members of what 80s group?", "Toto"],
  ["Dim sum, a meal of varied dishes originating in Chinese, translates loosely into English as “a little bit of” what?", "Heart"],
  ["Baby Ruth’s creator claimed his candy bar was named not for a ball player, but for what President’s daughter?", "Grover Cleveland"],
  ["Henry James famously remarked that “the two most beautiful words in the English language” are what?", "Summer Afternoon"],
  ["While the winner of the Kentucky derby is draped in red roses, the Belmont stakes winner receives a garland of what?", "White Carnations"],
  ["The inscription “Pass and Stow,” appears on which of these US landmarks?", "Liberty Bell"],
  ["What song’s famous melody was written in 1893 by sisters Patty and Mildred Hill?", "Happy Birthday to You"],
  ["Under President Ford, 34 year old Dick Cheney became the youngest man to hold what position?", "Chief of Staff"],
  ["Born with the less cool-sounding name Walter, which of these actors prefers to go by his middle name?", "Bruce Willis"],
  ["In Egyptian mythology, a criosphinx is a figure that has the body of a lion and the head of a what?", "Ram"],
  ["The first X-ray photograph taken of the human body was an image of the hand of what scientist’s wife?", "Wilhem Roentgen"],
  ["Played at Wimbledon in 2010, the longest match in tennis history lasted how long?", "11 hours and 5 minutes"],
  ["What is the first name of blues guitar legend B.B. King?", "Riley"],
  ["The Leaning Tower of Pisa leans in what direction?", "South"],
  ["Prized for their distinctive flavor, vanilla beans are the fruit of a rare type of what flower?", "Orchids"],
  ["Founded in 1964, the restaurant Benihana takes its name from a Japanese phrase meaning what?", "Red Flower"],
  ["Known for his reckless spending, what movie star once paid $276,000 for a dinosaur skull?", "Nicholas Cage"],
  ["On Sesame Street, the feathers on the big bird costume, excluding the tail, are from what bird?", "Turkey"],
  ["In Stephen Spielburg’s 1982 classic, E.T. watches a love scene from what film?", "The Quiet Man"],
  ["During the Titanic disaster, what nearby ship was accused of ignoring its distress signals?", "Californian"],
  ["In 1944, frustrated Congressman Maury Maverick coined what word for Washington jargon?", "Gobbledygook"],
  ["Which First Lady was a ninth-generation descendant of Pocahantas?", "Edith Wilson"],
  ["The Sony Walkman was originally marketed in the U.S. under what name?", "Soundabout"],
  ["Forty times longer than the U.S. Constitution, what state’s constitution is the longest in the world?", "Alabama"],
  ["According to the Japanese toy company Sanrio, what is Hello Kitty’s full name?", "Kitty White"],
  ["In 1962, John Glenn became the first American to eat in space when he ate what food out of a tube?", "Applesauce"],
  ["Celebrated on the first day of May, Primero De Mayo is the Mexican equivalent of what U.S. holiday?", "Labor Day"],
  ["What European capital’s airport is named in honor of its famous resident, composer Frederick Chopin?", "Warsaw"],
  ["The late rapper Tupac Shukar was named after Tupac Amaru II, an 18th century revolutionary in what country?", "Peru"],
  ["Though most famous for other endeavors, which businessman is known for inventing the charcoal briquette?", "Henry Ford"],
  ["Deltiology is the study of collecting what everyday object?", "Postcards"],
  ["What does an oniomaniac love to do?", "Shop"],
  ["On July 12, 2000, Russia launched a rocket into space bearing the corporate logo of what company", "Pizza Hut"],
  ["Popular with gourmet chefs, Jerusalem artichokes are not artichokes, but a species of what?", "Sunflower"],
  ["Opus Dei, the controversial Roman Catholic organization, was founded in 1928 in what country?", "Spain"],
  ["The original Declaration of Independence is housed in a sealed case filled with what inert gas?", "Argon"],
  ["The coffee tree is believe to have originated in the Kaffa region of what present-day country?", "Ethiopia"],
  ["A southpaw boxer is typically left-handed, but which of these terms describes a right-handed fighter?", "Orthodox"],
  ["Patzer is slang for someone who is bad at playing what?", "Chess"],
  ["Until switching over to vanilla in the 1940s, Hostess Twinkies had what flavor cream filling?", "Banana"],
  ["What was the name of the first chimpanzee sent into space by NASA?", "Ham"],
  ["A person who suffers from gamophobia has an exaggerated fear of what?", "Marriage"],
  ["What film actress’s death was reported on the front page of the debut issue of USA Today?", "Grace Kelly"],
  ["In 2001, which of these people was named Honorary Sergeant, Regular Army by President Clinton?", "Sacagawea"],
  ["What celestial object was named in 1930, by an eleven-year-old girl named Venetia Burney?", "Pluto"],
  ["In 1973,what major tennis tournament became the first to offer equal prize money to both men and women?", "U.S. Open"],
  ["Diamonds being the hardest, which of these gems is the second hardest according to the Mohs scale?", "Sapphire"],
  ["As chefs know,the two succulent bits of meat on the back of a chicken, just above the thigh, are called what?", "Oysters"],
  ["Well known to coin collectors, the Toven Specimen is an extremely rare example of what type of coin?", "Penny"],
  ["Introduced in 1847,the first two stamps issued by the USPS featured George Washington and what other American?", "Benjamin Franklin"],
  ["Warfarin,a popular blood thinner medication,was originally developed and is still used as a what?", "Rat poison"],
  ["On Amelia Earhart’s historic 1932 solo flight across the Atlantic Ocean,she landed in what country?", "Ireland"],
  ["Dying days later,what U.S. president is thought to have contracted cholera from iced milk and cherries at a 4th of July celebration?", "Zachary Taylor"],
  ["The name of the Arab television network Jazeera literally means what?", "The Island"],
  ["According to legend, what did Guinevere’s father give King Arthur as a wedding gift?", "The Round Table"],
  ["As the result of a duel,what president harbored a bullet near his heart for the last 39 years of his life?", "Andrew Jackson"],
  ["Since 1962,jousting has been the official sport of what U.S. state?", "Maryland"],
  ["In 2008, a National Science Foundation survey said what nation’s residents are the happiest in the world?", "Denmark"],
  ["As your florist can tell you, a tussie-mussie bouquet is most similar to what other kind of bouquet?", "Nosegay"],
  ["At the end of a Czech wedding,it is customary to shower the couple with what instead of rice?", "Peas"],
  ["In 1994, what TV show broke ground depicting a gay marriage between inkeepers Ron and Erick?", "Northern Exposure"],
  ["Queen Victoria’s 1840 wedding is credited with popularizing what tradition?", "White Bridal Gown"],
  ["Long before you could buy them at Jared’s, what ancient people believed diamonds were tears of the gods?", "Greeks"],
  ["A popular real-life destination for eloping couples, the Scottish town of Gretna Green is referenced in what classic novel?", "Pride and Prejudice"],
  ["An early race of humans,the Cro-Magnons are named after a cave in what country?", "France"],
  ["Muenster is a semisoft cheese that is named after a city in what European country?", "France"],
  ["Before taking its current name, what Internet company was originally called BackRub?", "Google"],
  ["Featuring participants slathered in olive oil, what nation has hosted the Kirkpinar wrestling festival since 1346?", "Turkey"],
  ["Bitterballen, deep-fried meatballs with mustard, are a traditional treat of what European nation?", "Netherlands"],
  ["In 2012, pop icon Beyonce gave birth to a daughter with what colorful, unusual name?", "Blue Ivy"],
  ["What is Dora the Explorer’s last name?", "Marquez"],
  ["What island is often identified on maps by its local name, Kalaallit Nunaat?", "Greenland"],
  ["A resident of Sesame Street since 1969, green,garbage-loving Oscar the Grouch was originally what color?", "Orange"],
  ["Who was the first Australian-born actor to win an Academy Award?", "Geoffrey Rush"],
  ["In an infamous act of betrayal, Benedict Arnold arranged to surrender what military base to the British?", "West Point"],
  ["Ron Wayne, who would be a billionaire today had he not sold his 10% stake for $800 back in 1976, co-founded what company?", "Apple"],
  ["In 1968, what overzealous airline began taking reservations for lunar flights that were set to take off in 2000?", "Pan Am"],
  ["Though his real name is Riley B. King, the initials in guitarist B.B. King’s stage name stand for what?", "Blue Boys"],
  ["Once included in its country’s name,the word “Soviet” actually means what in Russian?", "Council"],
  ["The Canadian national flag features a stylized red maple leaf that has how many points?", "11"],
  ["According to Greek myth, Persephone was forced to spend part of the year in Hades after eating what?", "Pomegranate seeds"],
  ["The chimes in London’s Big Ben clock tower play a tune from a famous work by what composer?", "Handel"],
  ["Thought to be the source of a classic joke, “Knock, knock, knock! Who’s there…?” is a line from what Shakespeare play?", "Macbeth"],
  ["A popular pastime the world over, “karaoke” is a Japanese word which roughly translates to what?", "Empty Orchestra"],
  ["In its lesser-known verses, what popular song tells the story of a headstrong woman named Nelly Kelly?", "Take Me Out to the Ballgame"],
  ["In fireworks, the color blue is created by burning compounds of what metal?", "Copper"],
  ["Whose New York Times obituary mentioned that “Since 1889” he “had been hopelessly insane”?", "Friedrich Nietzsche"],
  ["Joseph Smith, founder of the Mormon church, believed the Garden on Eden was located where?", "Missouri"],
  ["In 1974, what product became the first to be scanned by a retailer using the UPC bar code?",	"Wrigley’s Gum"],
  ["Ian Fleming named his greatest literary creation, fictional spy James Bond, after a real-life what?", "American Ornithologist"],
  ["In the Tv series “The Brady Bunch,” what is Carol Brady’s maiden name?", "Tyler"],
  ["What lesser-known Patrick Swayze film was the first movie to be released with a PG-13 rating?",	"Red Dawn"],
  ["According to NASA, what is the only planet in the solar system that would be able to float in water?", "Saturn"],
  ["In the song “Grandma Got Run Over By A Reindeer,” which of these facts about Grandma is not revealed?", "She lost her hearing aids"],
  ["Leonardo Da Vinci wrote his famous notebooks mainly using what unusual method?", "Mirror writing"],
  ["What does the Russian name “Sputnik” mean in English?", "Traveling companion"]
]

Enum.each questions, fn question -> 
  [q | a] = question

  %Answer{
    question: %Question{
      content: q
    },
    content: Enum.at(a, 0)
  } |> Repo.insert!
end
